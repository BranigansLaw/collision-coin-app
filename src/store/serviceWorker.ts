import { Reducer, Action, AnyAction, ActionCreator } from 'redux';
import { neverReached, IAppState } from '.';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { skipWaiting } from '..';

// Store
export interface IServiceWorkerState {
    readonly updateAvailable: boolean;
}

const initialSyncState: IServiceWorkerState = {
    updateAvailable: false,
};

// Actions
interface IUpdateAvailableAction extends Action<'UpdateAvailable'> {}

interface IUpdateServiceWorkerAction extends Action<'UpdateServiceWorker'> {}

export type ServiceWorkerActions = 
    | IUpdateAvailableAction
    | IUpdateServiceWorkerAction;

// Action Creators
export const updateAvailableActionCreator: ActionCreator<
    ThunkAction<
        Promise<boolean>,   // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        IUpdateAvailableAction // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        dispatch({
            type: 'UpdateAvailable',
        } as IUpdateAvailableAction);

        return false;
    };
};

export const updateServiceWorkerSkipWaitingActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,   // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        IUpdateAvailableAction // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        dispatch({
            type: 'UpdateServiceWorker',
        } as IUpdateServiceWorkerAction);

        skipWaiting();
    };
};

// Reducers
export const serviceWorkerReducer: Reducer<IServiceWorkerState, ServiceWorkerActions> = (
    state = initialSyncState,
    action,
) => {
    switch (action.type) {
        case 'UpdateAvailable': {
            return {
                ...state,
                updateAvailable: true,
            };
        }
        case 'UpdateServiceWorker': {
            return {
                ...state,
                updateAvailable: false,
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};