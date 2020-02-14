import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IOfflineAppState } from '.';
import axios, { AxiosResponse } from 'axios';
import { IAttendee, ICreateAttendeeCollisionAction, IUpdateAttendeeNotesAction } from './attendee';
import { IProfile } from './profile';
import { ILogoutAction, ILoginThirdPartySuccessAction, IRegisterSuccessAction, ILoginSuccessAction } from './auth';
import { OfflineAction } from '@redux-offline/redux-offline/lib/types';
import { Guid } from 'guid-typescript';
import { getCurrentTimeEpochMilliseconds } from '../util';
import { IUpdateProfileAction } from './profile';

// Store
export interface ISyncState {
    readonly lastSyncEpochMilliseconds: number;
    readonly syncIntervalMilliseconds: number;
    readonly actionQueue: ApiAction<ApiActions>[];
}

interface ILogoutRequeueAction extends Action<'LogoutRequeue'> {}

export type ApiActions = 
    | IDataSyncAction
    | IUpdateProfileAction
    | IUpdateAttendeeNotesAction
    | ICreateAttendeeCollisionAction
    | ILogoutRequeueAction;

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

const wrapResponse = async (axiosPromise: Promise<AxiosResponse<any> | undefined>, dispatch: ThunkDispatch<any, any, AnyAction>): Promise<AxiosResponse<any> | undefined> => {
    try {
        const res: AxiosResponse<any> | undefined = await axiosPromise;
        return res;
    }
    catch (e) {
        if (e.isAxiosError && e.response.status === 401) {
            dispatch({
                type: 'Logout',
                isForceLogout: true,
            } as ILogoutAction);
            return undefined;
        }

        return undefined;
    }
}

export const handleApiAction = async (action: ApiAction<ApiActions>, state: IOfflineAppState, dispatch: ThunkDispatch<any, any, AnyAction>) => {
    let res: AxiosResponse<any> | undefined = undefined;
    const headers = {
        'Access-Control-Allow-Origin': '*',
        authorization: `Bearer ${state.authState.authToken}`,
        TransactionId: action.transactionId.toString(),
    };

    try {
        switch (action.meta.type) {
            case 'DataSync':
                res = await wrapResponse(axios.get(
                    `${process.env.REACT_APP_API_ROOT_URL}sync/${state.sync.lastSyncEpochMilliseconds}`,
                    {
                        headers
                    }), dispatch);
                    
                if (res !== undefined) {
                    dispatch({
                        type: 'ReceivedDataSync',
                        attendeeCollisions: res.data.attendeeCollisions,
                        myProfile: res.data.myProfile,
                        balance: res.data.myWallet !== null ? res.data.myWallet.balance : null,
                        addAttendeeCoins: res.data.appSettings !== null ? res.data.appSettings.attendeeCollisionCoinsEarned : null,
                        syncIntervalMilliseconds: res.data.appSettings !== null ? res.data.appSettings.syncIntervalMilliseconds : null,
                        epochUpdateTimeMilliseconds: res.data.epochUpdateTimeMilliseconds,
                    } as IReceivedDataSyncAction);
                }
                break;
            case 'UpdateProfile':
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}profile/update`,
                    {
                        newCompanyName: action.meta.newCompanyName,
                        newPosition: action.meta.newPosition,
                    },
                    {
                        headers
                    }), dispatch);
                break;
            case 'UpdateAttendeeNotes':
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}collision/attendee/${action.meta.attendeeId.toString()}/update`,
                    {
                        updatedNotes: action.meta.updatedNotes
                    },
                    {
                        headers
                    }), dispatch);
                break;
            case 'CreateAttendeeCollision':
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}collision/attendee`,
                    {
                        toUserId: action.meta.attendeeId,
                    },
                    {
                        headers
                    }), dispatch);
                break;
            case 'LogoutRequeue':
                dispatch(action.meta);
                break;
            default:
                neverReached(action.meta); // when a new action is created, this helps us remember to handle it in the reducer
        }
    }
    catch (e) {
        res = e.response;
    }

    return res;
};

const initialSyncState: ISyncState = {
    lastSyncEpochMilliseconds: 0,
    syncIntervalMilliseconds: 1000000,
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
    attendeeCollisions: IAttendee[];
    myProfile: IProfile;
    balance: number | null;
    addAttendeeCoins: number | null;
    syncIntervalMilliseconds: number | null;
    epochUpdateTimeMilliseconds: number;
}

export type SyncActions =
    | IDequeueAction
    | IIncrementNumTries
    | IReceivedDataSyncAction
    | ILogoutAction
    | ApiActions
    | ILoginSuccessAction
    | IRegisterSuccessAction
    | ILoginThirdPartySuccessAction;

export const checkQueueActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,     // The type of the last action to be dispatched - will always be promise<T> for async actions
        IOfflineAppState,  // The type for the data within the last action
        null,              // The type of the parameter for the nested function 
        IDataSyncAction    // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IOfflineAppState) => {
        console.log('Check data queue');
        try {
            if (getState().offline.online) {
                let completedActions: ApiAction<ApiActions>[] = [];
                let failedActions: ApiAction<ApiActions>[] = [];

                for (const action of getState().sync.actionQueue) {
                    const res: AxiosResponse<any> | undefined =
                        await handleApiAction(action, getState(), dispatch);

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

                if (getState().authState.authToken !== undefined && 
                    (
                        completedActions.filter(a => a.meta.type !== 'DataSync').length > 0 ||
                        getCurrentTimeEpochMilliseconds() - getState().sync.lastSyncEpochMilliseconds > getState().sync.syncIntervalMilliseconds
                    )) {
                    dispatch({
                        type: 'DataSync',
                    } as IDataSyncAction);
                }
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
                syncIntervalMilliseconds: action.syncIntervalMilliseconds !== null ? action.syncIntervalMilliseconds : state.syncIntervalMilliseconds,
            };
        }
        case 'Logout': {
            return {
                ...initialSyncState,
                actionQueue: [ new ApiAction<ILogoutRequeueAction>({
                    type: 'LogoutRequeue',
                } as ILogoutRequeueAction) ]
            };
        }
        case 'LogoutRequeue': {
            return initialSyncState;
        }
        case 'DataSync': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<IDataSyncAction>(action) ],
            }
        }
        case 'CreateAttendeeCollision': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<ICreateAttendeeCollisionAction>(action) ],
            }
        }
        case 'UpdateProfile': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<IUpdateProfileAction>(action) ],
            }
        }
        case 'UpdateAttendeeNotes': {
            return {
                ...state,
                actionQueue: [ 
                    ...state.actionQueue.filter(q => q.meta.type !== 'UpdateAttendeeNotes' || q.meta.attendeeId !== action.attendeeId), 
                    new ApiAction<IUpdateAttendeeNotesAction>(action) ],
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
        case 'LoginSuccess':
        case 'LoginThirdPartySuccess':
        case 'RegisterSuccess':
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<IDataSyncAction>({
                    type: 'DataSync'
                } as IDataSyncAction) ]
            };
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};