import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IOfflineAppState } from '.';
import axios, { AxiosResponse } from 'axios';
import { IAttendee } from './attendee';
import { IProfile } from './profile';
import { ILogoutAction } from './auth';
import { OfflineAction } from '@redux-offline/redux-offline/lib/types';
import { Guid } from 'guid-typescript';
import { getCurrentTimeEpochMilliseconds } from '../util';
import { IUpdateProfileAction } from './profile';

// Store
export interface ISyncState {
    readonly lastSyncEpochMilliseconds: number;
    readonly actionQueue: ApiAction<ApiActions>[];
}

export type ApiActions = 
    | IDataSyncAction
    | IUpdateProfileAction;

export type ApiActionsWithResponses = IDataSyncAction;

export class ApiAction<A extends ApiActions> {
    readonly timeEpochMilliseconds: number;
    readonly transactionId: Guid;
    readonly meta: A;
    numTries: number;

    constructor(meta: A) {
        this.timeEpochMilliseconds = getCurrentTimeEpochMilliseconds();
        this.numTries = 0;
        this.transactionId = Guid.create();
        this.meta = meta;
    }
}

export const handleApiAction = async (action: ApiActions, state: IOfflineAppState, dispatch: ThunkDispatch<any, any, AnyAction>) => {
    let res: AxiosResponse<any> | undefined = undefined;
    const headers = {
        authorization: `Bearer ${state.authState.authToken}`,
        'Access-Control-Allow-Origin': '*'
    };

    try {
        switch (action.type) {
            case 'DataSync':
                res = (await axios.get(
                    `${process.env.REACT_APP_AUTH_ROOT_URL}api/sync/${state.sync.lastSyncEpochMilliseconds}`,
                    {
                        headers
                    }));
                    
                if (res !== undefined) {
                    dispatch({
                        type: 'ReceivedDataSync',
                        attendees: res.data.attendees,
                        myProfile: res.data.myProfile,
                        epochUpdateTimeMilliseconds: res.data.epochUpdateTimeMilliseconds,
                    } as IReceivedDataSyncAction);
                }
                break;
            case 'UpdateProfile':
                res = (await axios.post(
                    `${process.env.REACT_APP_AUTH_ROOT_URL}api/profile/update`,
                    {
                        newCompanyName: action.newCompanyName,
                        newPosition: action.newPosition,
                    },
                    {
                        headers
                    }));
                break;
            default:
                neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
        }
    }
    catch (e) {
        res = e.response;
    }

    return res;
};

const initialSyncState: ISyncState = {
    lastSyncEpochMilliseconds: 0,
    actionQueue: [],
};

export interface IAuditableEntity {
    deleted?: boolean;
}

// Actions
interface IDataSyncAction extends OfflineAction {
    type: 'DataSync';
}

interface IDequeueAction extends Action<'Deque'> {
    toDequeue: ApiAction<ApiActions>[];
}

interface IIncrementNumTries extends Action<'IncrementTries'> {
    toIncrementTransactionId: Guid;
}

export interface IReceivedDataSyncAction extends Action<'ReceivedDataSync'> {
    attendees: IAttendee[];
    myProfile: IProfile;
    epochUpdateTimeMilliseconds: number;
}

export type SyncActions =
    | IDequeueAction
    | IIncrementNumTries
    | IReceivedDataSyncAction
    | ILogoutAction
    | ApiActions;

export const checkQueueActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,     // The type of the last action to be dispatched - will always be promise<T> for async actions
        IOfflineAppState,  // The type for the data within the last action
        null,              // The type of the parameter for the nested function 
        IDataSyncAction    // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IOfflineAppState) => {
        try {
            if (getState().offline.online) {
                let completedActions: ApiAction<ApiActions>[] = [];
                let failedActions: ApiAction<ApiActions>[] = [];

                for (const action of getState().sync.actionQueue) {
                    const res: AxiosResponse<any> | undefined =
                        await handleApiAction(action.meta, getState(), dispatch);

                    if (res !== undefined && res.status === 401) {
                        // break immediately and logout
                    }
                    if (res !== undefined && (res.status >= 200 && res.status < 300)) {
                        completedActions.push(action);
                    }
                    if (res !== undefined && (res.status === 400)) {
                        // rollback somehow
                    }
                    else {
                        failedActions.push(action);
                    }
                }

                for (const action of failedActions) {
                    dispatch({
                        type: 'IncrementTries',
                        toIncrementTransactionId: action.transactionId,
                    } as IIncrementNumTries);
                }

                dispatch({
                    type: 'Deque',
                    toDequeue: completedActions,
                } as IDequeueAction);
            }
        }
        catch (e) {
            console.error(e);
        }

        setTimeout(() => dispatch(checkQueueActionCreator()), 5000);
    };
};

// Reducers
export const syncReducer: Reducer<ISyncState, SyncActions> = (
    state = initialSyncState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            return {
                ...state,
                lastSyncEpochMilliseconds: action.epochUpdateTimeMilliseconds,
            };
        }
        case 'Logout': {
            return initialSyncState;
        }
        case 'DataSync': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<IDataSyncAction>(action) ],
            }
        }
        case 'UpdateProfile': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<IUpdateProfileAction>(action) ],
            }
        }
        case 'Deque': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue.filter(a => action.toDequeue.filter(a1 => a.transactionId.toString() === a1.transactionId.toString()).length === 0) ]
            };
        }
        case 'IncrementTries': {
            const updatedQueue = state.actionQueue.map(a => {
                if (a.transactionId.toString() === action.toIncrementTransactionId.toString()) {
                    a.numTries++;
                }

                return a;
            });

            return {
                ...state,
                actionQueue: [ ...updatedQueue ]
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};