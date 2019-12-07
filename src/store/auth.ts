import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import axios from 'axios';
import { Guid } from 'guid-typescript';
import { RootUrls } from '../route';

// Store
export interface IAuthState {
    readonly loading: boolean;
    readonly authToken?: string;
    readonly redirectUrl?: string;
    readonly clientCode?: string;
}

const initialSyncState: IAuthState = {
    loading: false,
};

export enum ThirdParty {
    Google = 'Google',
    LinkedIn = 'LinkedIn',
}

// Actions
export interface ILoginSentAction extends Action<'LoginSent'> {}

export interface ILoginSuccessAction extends Action<'LoginSuccess'> {
    accessToken: string;
}

export interface ILoginFailedAction extends Action<'LoginFailed'> {}

export interface IRegisterSentAction extends Action<'RegisterSent'> {}

export interface IRegisterSuccessAction extends Action<'RegisterSuccess'> {
    accessToken: string;
}

export interface IRegisterFailedAction extends Action<'RegisterFailed'> {}

export interface ILoginThirdPartySentAction extends Action<'LoginThirdPartySent'> {}

export interface ILoginThirdPartySuccessAction extends Action<'LoginThirdPartySuccess'> {
    redirectUrl: string;
    clientCode: string;
}

export interface ILoginThirdPartyFailedAction extends Action<'LoginThirdPartyFailed'> {}

export type SyncActions =
    | ILoginSentAction
    | ILoginSuccessAction
    | ILoginFailedAction
    | IRegisterSentAction
    | IRegisterSuccessAction
    | IRegisterFailedAction
    | ILoginThirdPartySentAction
    | ILoginThirdPartySuccessAction
    | ILoginThirdPartyFailedAction;

// Action Creators
export const loginActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,      // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        ILoginSuccessAction // The type of the last action to be dispatched
    >
> = (email: string, password: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    };
};

export const thirdPartyLoginActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,                // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                    // The type for the data within the last action
        null,                         // The type of the parameter for the nested function 
        ILoginThirdPartySuccessAction // The type of the last action to be dispatched
    >
> = (loginType: ThirdParty, email?: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        dispatch({
            type: 'LoginThirdPartySent',
        } as ILoginThirdPartySentAction);
        const clientCode: string = Guid.create().toString();

        const redirectUrl: string = (await axios.post(
            `${process.env.REACT_APP_AUTH_ROOT_URL}third-party-login/${loginType}`,
            {
                clientCode,
                redirectUrl: `${window.location.protocol}//${window.location.host}${RootUrls.thirdPartyAuth()}`,
                userEmail: email,
            },
            {
                headers: { 
                    'Access-Control-Allow-Origin': '*'
                }
            })).data.redirectUrl;

        dispatch({
            type: 'LoginThirdPartySuccess',
            clientCode,
            redirectUrl,
        } as ILoginThirdPartySuccessAction);
    };
};

export const registerActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,      // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        ILoginSuccessAction // The type of the last action to be dispatched
    >
> = (email: string, password: string, code: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        // Implement later
    };
};

// Reducers
export const authReducer: Reducer<IAuthState, SyncActions> = (
    state = initialSyncState,
    action,
) => {
    switch (action.type) {
        case 'LoginSent':
            return {
                loading: true,
                ...state,
            };
        case 'LoginSuccess':
            return {
                loading: false,
                accessToken: action.accessToken,
                ...state,
            };
        case 'LoginFailed':
            return state;
        case 'RegisterSent':
            return state;
        case 'RegisterSuccess':
            return state;
        case 'RegisterFailed':
            return state;
        case 'LoginThirdPartySent':
            return {
                loading: true,
            };
        case 'LoginThirdPartySuccess':
            return {
                loading: false,
                clientCode: action.clientCode,
                redirectUrl: action.redirectUrl,
            };
        case 'LoginThirdPartyFailed':
            return state;
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};