import { Action, ActionCreator, Reducer, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { OfflineAction } from '@redux-offline/redux-offline/lib/types';

// Store
export interface ISyncState {
    readonly lastSyncEpochMilliseconds: number;
}

const initialPeopleState: ISyncState = {
    lastSyncEpochMilliseconds: 0,
};

// Actions
export interface IGetDataSyncAction extends OfflineAction {
    type: 'GetDataSync',
}

export interface IReceivedDataSyncAction extends Action<'ReceivedDataSync'> {
}

export type SyncActions =
    | IGetDataSyncAction
    | IReceivedDataSyncAction;

// Action Creators
export const syncActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,              // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                  // The type for the data within the last action
        null,                       // The type of the parameter for the nested function 
        IGetDataSyncAction          // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
    
        const lastUpdate: number = getState().sync.lastSyncEpochMilliseconds;
        const getDataSyncAction: IGetDataSyncAction = {
            type: 'GetDataSync',
            meta: {
                offline: {
                    effect: {
                        url: `https://collisioncoinservices.tyficonsulting.com/api/Sync/${lastUpdate}`,
                        method: 'GET',
                    },
                    commit: { type: 'ReceivedDataSync', meta: { completed: true, success: true} },
                },
            },
        };
        dispatch(getDataSyncAction);
    };
};

// Reducers
export const syncReducer: Reducer<ISyncState, SyncActions> = (
    state = initialPeopleState,
    action,
) => {
    switch (action.type) {
        case 'GetDataSync': {   
            return {
                ...state,
            };
        }
        case 'ReceivedDataSync': {
            return {
                ...state,
                lastSyncEpochMilliseconds: (new Date()).getTime(),
            };
        }
        default:
        neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};