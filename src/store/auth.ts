import { ActionCreator, Reducer, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { OfflineAction, ResultAction } from '@redux-offline/redux-offline/lib/types';

// Store
export interface IAuthState {
    readonly authToken?: string;
}

const initialSyncState: IAuthState = {
    authToken: undefined,
};

// Actions
export interface ISendGoogleAuthAction extends OfflineAction {
    type: 'SendGoogleAuth';
}

export interface IReceivedGoogleAuthAction extends ResultAction {
    type: 'ReceivedGoogleAuth';
    payload: {
        token: string;
    }
}

export interface IRollbackGoogleAuthAction extends ResultAction {
    type: 'RollbackGoogleAuth';
}

export type SyncActions =
    | ISendGoogleAuthAction
    | IReceivedGoogleAuthAction
    | IRollbackGoogleAuthAction;

// Action Creators
export const googleAuthActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,              // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                  // The type for the data within the last action
        null,                       // The type of the parameter for the nested function 
        ISendGoogleAuthAction          // The type of the last action to be dispatched
    >
> = (googleToken: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        debugger;
        const sendGoogleAuthAction: ISendGoogleAuthAction = {
            type: 'SendGoogleAuth',
            meta: {
                offline: {
                    effect: {
                        url: `https://localhost:44342/auth/googleauth/`,
                        method: 'POST',
                        body: JSON.stringify({
                            idToken: googleToken,
                        }),
                    },
                    commit: {
                        type: 'ReceivedGoogleAuth',
                        meta: {
                            completed: true,
                            success: true
                        },
                    } as IReceivedGoogleAuthAction,
                    rollback: {
                        type: 'RollbackGoogleAuth',
                    } as IRollbackGoogleAuthAction
                },
            },
        };

        dispatch(sendGoogleAuthAction);
    };
};

// Reducers
export const authReducer: Reducer<IAuthState, SyncActions> = (
    state = initialSyncState,
    action,
) => {
    switch (action.type) {
        case 'SendGoogleAuth': {   
            return {
                ...state,
                authToken: undefined,
            };
        }
        case 'ReceivedGoogleAuth': {
            return {
                ...state,
                authToken: action.payload.token,
            };
        }
        case 'RollbackGoogleAuth': {
            return {
                ...state,
                authToken: undefined,
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};