import { ActionCreator, Reducer, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { OfflineAction, ResultAction } from '@redux-offline/redux-offline/lib/types';
import { IAttendee } from './attendee';
import { IProfile } from './profile';

// Store
export interface ISyncState {
    readonly lastSyncEpochMilliseconds: number;
    readonly currentlySyncing: boolean;
}

const initialSyncState: ISyncState = {
    lastSyncEpochMilliseconds: 0,
    currentlySyncing: false,
};

let timer: NodeJS.Timeout | undefined = undefined;

export interface IAuditableEntity {
    deleted?: boolean;
}

// Actions
export interface IGetDataSyncAction extends OfflineAction {
    type: 'GetDataSync';
}

export interface IReceivedDataSyncAction extends ResultAction {
    type: 'ReceivedDataSync';
    payload: {
        attendees: IAttendee[];
        userProfile: IProfile;
        epochUpdateTimeMilliseconds: number;
    }
}

export interface IRollbackSyncAction extends ResultAction {
    type: 'RollbackDataSync';
}

export type SyncActions =
    | IGetDataSyncAction
    | IReceivedDataSyncAction
    | IRollbackSyncAction;

// Action Creators
export const startSyncIntervalActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,              // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                  // The type for the data within the last action
        null,                       // The type of the parameter for the nested function 
        IGetDataSyncAction          // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        if (timer !== undefined) {
            return;
        }
        
        dispatch(syncActionCreator());
        timer = setInterval(() => dispatch(syncActionCreator()), 5000);
    };
};

export const stopSyncIntervalActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,              // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                  // The type for the data within the last action
        null,                       // The type of the parameter for the nested function 
        IGetDataSyncAction          // The type of the last action to be dispatched
    >
> = () => {
    return async () => {
        if (timer !== undefined) {
            clearInterval(timer);
        }
    };
};

const syncActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,              // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                  // The type for the data within the last action
        null,                       // The type of the parameter for the nested function 
        IGetDataSyncAction          // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        if (getState().sync.currentlySyncing || 
            getState().authState.authToken === undefined) {
            return;
        }

        const lastUpdate: number = getState().sync.lastSyncEpochMilliseconds;
        const getDataSyncAction: IGetDataSyncAction = {
            type: 'GetDataSync',
            meta: {
                offline: {
                    effect: {
                        url: `https://localhost:44342/api/Sync/${lastUpdate}`,
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${getState().authState.authToken}`,
                        }
                    },
                    commit: {
                        type: 'ReceivedDataSync',
                        meta: {
                            completed: true,
                            success: true
                        },
                    } as IReceivedDataSyncAction,
                    rollback: {
                        type: 'RollbackDataSync',
                    } as IRollbackSyncAction
                },
            },
        };

        dispatch(getDataSyncAction);
    };
};

// Reducers
export const syncReducer: Reducer<ISyncState, SyncActions> = (
    state = initialSyncState,
    action,
) => {
    switch (action.type) {
        case 'GetDataSync': {   
            return {
                ...state,
                currentlySyncing: true,
            };
        }
        case 'ReceivedDataSync': {
            let newUpdateTime = action.payload.epochUpdateTimeMilliseconds;

            return {
                ...state,
                lastSyncEpochMilliseconds: newUpdateTime,
                currentlySyncing: false,
            };
        }
        case 'RollbackDataSync': {
            return {
                ...state,
                currentlySyncing: false,
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};