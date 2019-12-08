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
    clientCode: string;
}

export interface ILoginThirdPartyFailedAction extends Action<'LoginThirdPartyFailed'> {}

export interface ILoginThirdPartyRedeemTokenSentAction extends Action<'LoginThirdPartyRedeemTokenSent'> {}

export interface ILoginThirdPartyRedeemTokenSuccessAction extends Action<'LoginThirdPartyRedeemTokenSuccess'> {
    accessToken: string;
}

export interface ILoginThirdPartyRedeemTokenFailedAction extends Action<'LoginThirdPartyRedeemTokenFailed'> {}

export type SyncActions =
    | ILoginSentAction
    | ILoginSuccessAction
    | ILoginFailedAction
    | IRegisterSentAction
    | IRegisterSuccessAction
    | IRegisterFailedAction
    | ILoginThirdPartySentAction
    | ILoginThirdPartySuccessAction
    | ILoginThirdPartyFailedAction
    | ILoginThirdPartyRedeemTokenSentAction
    | ILoginThirdPartyRedeemTokenSuccessAction
    | ILoginThirdPartyRedeemTokenFailedAction;

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

export const registerActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,      // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        ILoginSuccessAction // The type of the last action to be dispatched
    >
> = (email: string, code: string, password: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    };
};

export const thirdPartyLoginActionCreator: ActionCreator<
    ThunkAction<
        Promise<string>,              // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                    // The type for the data within the last action
        null,                         // The type of the parameter for the nested function 
        ILoginThirdPartySuccessAction // The type of the last action to be dispatched
    >
> = (loginType: ThirdParty, userId: string | null, code: string | null) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'LoginThirdPartySent',
        } as ILoginThirdPartySentAction);
        const clientCode: string = Guid.create().toString();

        const redirectUrl: string = (await axios.post(
            `${process.env.REACT_APP_AUTH_ROOT_URL}third-party-login/${loginType}`,
            {
                clientCode,
                redirectUrl: `${window.location.protocol}//${window.location.host}${RootUrls.thirdPartyAuth()}`,
                userKey: userId,
                code: code,
            },
            {
                headers: { 
                    'Access-Control-Allow-Origin': '*'
                }
            })).data.redirectUrl;

        dispatch({
            type: 'LoginThirdPartySuccess',
            clientCode,
        } as ILoginThirdPartySuccessAction);

        return redirectUrl;
    };
};

export const thirdPartyRedeemTokenActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,                           // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                               // The type for the data within the last action
        null,                                    // The type of the parameter for the nested function 
        ILoginThirdPartyRedeemTokenSuccessAction // The type of the last action to be dispatched
    >
> = (redemptionToken: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'LoginThirdPartyRedeemTokenSent',
        } as ILoginThirdPartyRedeemTokenSentAction);

        const token: string = (await axios.post(
            `${process.env.REACT_APP_AUTH_ROOT_URL}third-party-redeem`,
            {
                clientCode: getState().authState.clientCode,
                redemptionCode: redemptionToken,
            },
            {
                headers: { 
                    'Access-Control-Allow-Origin': '*'
                }
            })).data.value.token;

        dispatch({
            type: 'LoginThirdPartyRedeemTokenSuccess',
            accessToken: token,
        } as ILoginThirdPartyRedeemTokenSuccessAction);
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
                ...state,
                loading: true,
            };
        case 'LoginSuccess':
            return {
                ...state,
                loading: false,
                accessToken: action.accessToken,
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
                ...state,
                loading: true,
            };
        case 'LoginThirdPartySuccess':
            return {
                ...state,
                loading: false,
                clientCode: action.clientCode,
            };
        case 'LoginThirdPartyFailed':
            return state;
        case 'LoginThirdPartyRedeemTokenSent':
            return {
                ...state,
                loading: true,
            };
        case 'LoginThirdPartyRedeemTokenSuccess':
            return {
                ...state,
                loading: false,
                authToken: action.accessToken,
                redirectUrl: undefined,
                clientCode: undefined,
            };
        case 'LoginThirdPartyRedeemTokenFailed':
            return state;
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};