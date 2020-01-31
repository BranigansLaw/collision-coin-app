import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import axios, { AxiosResponse } from 'axios';
import { Guid } from 'guid-typescript';
import { RootUrls } from '../route';

// Store
interface authFlag {
    googleAuth: boolean;
    linkedinAuth: boolean;
    normalAuth: boolean;
}

interface authFailedMessage {
    googleAuth?: string;
    linkedinAuth?: string;
    normalAuth?: string;
}

export interface IAuthState {
    readonly loading: authFlag;
    readonly loginFailed: authFailedMessage;
    readonly redeemTokenLoading: boolean;
    readonly authToken?: string;
    readonly clientCode?: string;
    readonly wasForcedLogout: boolean;
}

const initialSyncState: IAuthState = {
    loading: {
        googleAuth: false,
        linkedinAuth: false,
        normalAuth: false,
    },
    loginFailed: {
        googleAuth: undefined,
        linkedinAuth: undefined,
        normalAuth: undefined,
    },
    redeemTokenLoading: false,
    wasForcedLogout: false,
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

export interface ILoginFailedAction extends Action<'LoginFailed'> {
    reason: string;
}

export interface IRegisterSentAction extends Action<'RegisterSent'> {}

export interface IRegisterSuccessAction extends Action<'RegisterSuccess'> {
    accessToken: string;
}

export interface IRegisterFailedAction extends Action<'RegisterFailed'> {
    reason: string;
}

export interface ILoginThirdPartySentAction extends Action<'LoginThirdPartySent'> {
    authType: ThirdParty;
}

export interface ILoginThirdPartySuccessAction extends Action<'LoginThirdPartySuccess'> {
    clientCode: string;
}

export interface ILoginThirdPartyFailedAction extends Action<'LoginThirdPartyFailed'> {
    authType: ThirdParty;
}

export interface ILoginThirdPartyRedeemTokenSentAction extends Action<'LoginThirdPartyRedeemTokenSent'> {}

export interface ILoginThirdPartyRedeemTokenSuccessAction extends Action<'LoginThirdPartyRedeemTokenSuccess'> {
    accessToken: string;
}

export interface ILoginThirdPartyRedeemTokenFailedAction extends Action<'LoginThirdPartyRedeemTokenFailed'> {
    reason: string;
}

export interface ILogoutAction extends Action<'Logout'> {
    isForceLogout: boolean;
}

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
    | ILoginThirdPartyRedeemTokenFailedAction
    | ILogoutAction;

// Action Creators
export const loginActionCreator: ActionCreator<
    ThunkAction<
        Promise<boolean>,   // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        ILoginSuccessAction // The type of the last action to be dispatched
    >
> = (username: string, password: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        dispatch({
            type: 'LoginSent',
        } as ILoginSentAction);

        let res: AxiosResponse<any> | undefined;
        try {
            res = (await axios.post(
                `${process.env.REACT_APP_AUTH_ROOT_URL}normal-auth-login`,
                {
                    username,
                    password,
                },
                {
                    headers: { 
                        'Access-Control-Allow-Origin': '*'
                    }
                }));
        }
        catch (e) { }

        if (res !== undefined && res.status === 200) {
            dispatch({
                type: 'LoginSuccess',
                accessToken: res.data.token,
            } as ILoginSuccessAction);

            return true;
        }
        else if (res !== undefined && res.status === 401) {
            dispatch({
                type: 'RegisterFailed',
                reason: 'User/password combination was not found.',
            } as IRegisterFailedAction);
        }
        else if (res !== undefined) {
            dispatch({
                type: 'LoginFailed',
                reason: res.data.length < 1 ? 'Error logging in.' : res.data[0].description,
            } as ILoginFailedAction);
        }
        else {
            dispatch({
                type: 'LoginFailed',
                reason: 'Error logging in.',
            } as ILoginFailedAction);
        }

        return false;    
    };
};

export const registerActionCreator: ActionCreator<
    ThunkAction<
        Promise<boolean>,   // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        ILoginSuccessAction // The type of the last action to be dispatched
    >
> = (username: string, password: string, code: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        dispatch({
            type: 'RegisterSent',
        } as IRegisterSentAction);

        let res: AxiosResponse<any> | undefined;
        try {
            res = (await axios.post(
                `${process.env.REACT_APP_AUTH_ROOT_URL}normal-auth-register`,
                {
                    username,
                    password,
                    code,
                },
                {
                    headers: { 
                        'Access-Control-Allow-Origin': '*'
                    }
                }));
        }
        catch (e) { }
        
        if (res !== undefined && res.status === 200) {
            dispatch({
                type: 'RegisterSuccess',
                accessToken: res.data.token,
            } as IRegisterSuccessAction);

            return true;
        }
        else if (res !== undefined && res.status === 404) {
            dispatch({
                type: 'RegisterFailed',
                reason: 'User not found',
            } as IRegisterFailedAction);
        }
        else if (res !== undefined) {
            dispatch({
                type: 'RegisterFailed',
                reason: res.data.length < 1 ? 'Error registering.' : res.data[0].description,
            } as IRegisterFailedAction);
        }
        else {
            dispatch({
                type: 'RegisterFailed',
                reason: 'Error registering.',
            } as IRegisterFailedAction);
        }

        return false;
    };
};

export const thirdPartyLoginActionCreator: ActionCreator<
    ThunkAction<
        Promise<string | undefined>,  // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                    // The type for the data within the last action
        null,                         // The type of the parameter for the nested function 
        ILoginThirdPartySuccessAction // The type of the last action to be dispatched
    >
> = (loginType: ThirdParty, userId: string | undefined, code: string | undefined) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'LoginThirdPartySent',
            authType: loginType,
        } as ILoginThirdPartySentAction);
        const clientCode: string = Guid.create().toString();

        let res: AxiosResponse<any> | undefined;
        try {
            res = (await axios.post(
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
                }));
        }
        catch (e) { }

        if (res !== undefined && res.status === 200) {
            dispatch({
                type: 'LoginThirdPartySuccess',
                clientCode,
            } as ILoginThirdPartySuccessAction);
    
            return res.data.redirectUrl;
        }
        else {
            dispatch({
                type: 'LoginThirdPartyFailed',
                authType: loginType,
            } as ILoginThirdPartyFailedAction);

            return undefined;
        }
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

export const logoutActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,      // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,          // The type for the data within the last action
        null,               // The type of the parameter for the nested function 
        ILoginSuccessAction // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        dispatch({
            type: 'Logout',
        } as ILogoutAction);
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
                loading: {
                    ...state.loading,
                    normalAuth: true,
                },
                loginFailed: initialSyncState.loginFailed,
                wasForcedLogout: false,
            };
        case 'LoginSuccess':
            return {
                ...state,
                loading: initialSyncState.loading,
                loginFailed: initialSyncState.loginFailed,
                authToken: action.accessToken,
                wasForcedLogout: false,
            };
        case 'LoginFailed':
            return {
                ...state,
                loading: initialSyncState.loading,
                loginFailed: {
                    ...state.loginFailed,
                    normalAuth: action.reason,
                },
                wasForcedLogout: false,
            };
        case 'RegisterSent':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    normalAuth: true,
                },
                wasForcedLogout: false,
            };
        case 'RegisterSuccess':
            return {
                ...state,
                loading: initialSyncState.loading,
                loginFailed: initialSyncState.loginFailed,
                authToken: action.accessToken,
                wasForcedLogout: false,
            };
        case 'RegisterFailed':
            return {
                ...state,
                loading: initialSyncState.loading,
                loginFailed: {
                    ...state.loginFailed,
                    normalAuth: action.reason,
                },
                wasForcedLogout: false,
            };
        case 'LoginThirdPartySent':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    googleAuth: action.authType === ThirdParty.Google ? true : false,
                    linkedinAuth: action.authType === ThirdParty.LinkedIn ? true : false,
                },
                loginFailed: initialSyncState.loginFailed,
                wasForcedLogout: false,
            };
        case 'LoginThirdPartySuccess':
            return {
                ...state,
                loading: initialSyncState.loading,
                clientCode: action.clientCode,
                wasForcedLogout: false,
            };
        case 'LoginThirdPartyFailed':
            return {
                ...state,
                loading: initialSyncState.loading,
                loginFailed: {
                    ...state.loginFailed,
                    googleAuth: action.authType === ThirdParty.Google ? "There was an error loggin in. Please try again." : undefined,
                    linkedinAuth: action.authType === ThirdParty.LinkedIn ? "There was an error loggin in. Please try again." : undefined,
                },
                wasForcedLogout: false,
            };
        case 'LoginThirdPartyRedeemTokenSent':
            return {
                ...state,
                redeemTokenLoading: true,
                wasForcedLogout: false,
            };
        case 'LoginThirdPartyRedeemTokenSuccess':
            return {
                ...state,
                loading: initialSyncState.loading,
                authToken: action.accessToken,
                redirectUrl: undefined,
                clientCode: undefined,
                redeemTokenLoading: false,
                wasForcedLogout: false,
            };
        case 'LoginThirdPartyRedeemTokenFailed':
            return {
                ...state,
                redeemTokenLoading: false,
                wasForcedLogout: false,
            };
        case 'Logout':
            return {
                ...state,
                loading: initialSyncState.loading,
                authToken: undefined,
                wasForcedLogout: action.isForceLogout,
            };
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};