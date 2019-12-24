import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import axios, { AxiosResponse } from 'axios';
import { Guid } from 'guid-typescript';
import { RootUrls } from '../route';
import { IRollbackSyncAction } from './sync';

// Store
interface authFlag {
    googleAuth: boolean;
    linkedinAuth: boolean;
    normalAuth: boolean;
}

export interface IAuthState {
    readonly loading: authFlag;
    readonly loginFailed: authFlag;
    readonly redeemTokenLoading: boolean;
    readonly authToken?: string;
    readonly clientCode?: string;
}

const initialSyncState: IAuthState = {
    loading: {
        googleAuth: false,
        linkedinAuth: false,
        normalAuth: false,
    },
    loginFailed: {
        googleAuth: false,
        linkedinAuth: false,
        normalAuth: false,
    },
    redeemTokenLoading: false,
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

export interface ILoginThirdPartyRedeemTokenFailedAction extends Action<'LoginThirdPartyRedeemTokenFailed'> {}

export interface ILogoutAction extends Action<'Logout'> {}

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
    | ILogoutAction
    | IRollbackSyncAction;

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
        Promise<string | undefined>,  // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                    // The type for the data within the last action
        null,                         // The type of the parameter for the nested function 
        ILoginThirdPartySuccessAction // The type of the last action to be dispatched
    >
> = (loginType: ThirdParty, userId: string | null, code: string | null) => {
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
interface IHasStatus {
    status: number;
}

const is401Response = (payload: object): boolean => {
    if ((payload as IHasStatus).status === 401) {
        return true;
    }

    return false;
}

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
            };
        case 'LoginSuccess':
            return {
                ...state,
                loading: initialSyncState.loading,
                loginFailed: initialSyncState.loginFailed,
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
                loading: {
                    ...state.loading,
                    googleAuth: action.authType === ThirdParty.Google ? true : false,
                    linkedinAuth: action.authType === ThirdParty.LinkedIn ? true : false,
                },
                loginFailed: initialSyncState.loginFailed,
            };
        case 'LoginThirdPartySuccess':
            return {
                ...state,
                loading: initialSyncState.loading,
                clientCode: action.clientCode,
            };
        case 'LoginThirdPartyFailed':
            return {
                ...state,
                loading: initialSyncState.loading,
                loginFailed: {
                    ...state.loginFailed,
                    googleAuth: action.authType === ThirdParty.Google ? true : false,
                    linkedinAuth: action.authType === ThirdParty.LinkedIn ? true : false,
                }
            };
        case 'LoginThirdPartyRedeemTokenSent':
            return {
                ...state,
                redeemTokenLoading: true,
            };
        case 'LoginThirdPartyRedeemTokenSuccess':
            return {
                ...state,
                loading: initialSyncState.loading,
                authToken: action.accessToken,
                redirectUrl: undefined,
                clientCode: undefined,
                redeemTokenLoading: false,
            };
        case 'LoginThirdPartyRedeemTokenFailed':
            return {
                ...state,
                redeemTokenLoading: false,
            };
        case 'Logout':
            return {
                ...state,
                loading: initialSyncState.loading,
                authToken: undefined,
            };
        case 'RollbackDataSync': {
            if (action.payload !== undefined && is401Response(action.payload)) {
                return {
                    ...state,
                    authToken: undefined,
                };
            }

            return state;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};