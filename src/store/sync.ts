import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import axios, { AxiosResponse } from 'axios';
import { IAttendee } from './attendee';
import { IProfile } from './profile';
import { ILogoutAction } from './auth';

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
export interface IGetDataSyncAction extends Action<'GetDataSync'> {}

export interface IReceivedDataSyncAction extends Action<'ReceivedDataSync'> {
    attendees: IAttendee[];
    myProfile: IProfile;
    epochUpdateTimeMilliseconds: number;
}

export interface IRollbackSyncAction extends Action<'RollbackDataSync'> {
    code: number;
}

export type SyncActions =
    | IGetDataSyncAction
    | IReceivedDataSyncAction
    | IRollbackSyncAction
    | ILogoutAction;

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

        dispatch({
            type: 'GetDataSync',
        } as IGetDataSyncAction);

        let res: AxiosResponse<any> | undefined;
        try {
            res = (await axios.get(
                `${process.env.REACT_APP_API_ROOT_URL}sync/${lastUpdate}`,
                {
                    headers: { 
                        'Access-Control-Allow-Origin': '*',
                        authorization: `Bearer ${getState().authState.authToken}`,
                    }
                }));
        }
        catch (e) { }

        if (res !== undefined && res.status === 200) {
            if (getState().authState.authToken !== undefined) {
                dispatch({
                    type: 'ReceivedDataSync',
                    attendees: res.data.attendees,
                    myProfile: res.data.myProfile,
                    epochUpdateTimeMilliseconds: res.data.epochUpdateTimeMilliseconds,
                } as IReceivedDataSyncAction);
            }
            else {
                dispatch({
                    type: 'Logout',
                } as ILogoutAction);
            }
        }
        else {
            dispatch({
                type: 'RollbackDataSync',
                code: 401,
            } as IRollbackSyncAction);
        }
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
            return {
                ...state,
                lastSyncEpochMilliseconds: action.epochUpdateTimeMilliseconds,
                currentlySyncing: false,
            };
        }
        case 'RollbackDataSync': {
            return {
                ...state,
                currentlySyncing: false,
            };
        }
        case 'Logout': {
            timer = undefined;
            return initialSyncState;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};