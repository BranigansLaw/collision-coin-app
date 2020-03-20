import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction } from './sync';
import { ILogoutAction } from './auth';
import { IAttendeeBaseFields, IAttendee } from './attendee';
import { validNonEmptyString } from '../util';
import { handleApiCall } from './apiTransactionHandler';

// Store
export interface IProfile extends IAttendeeBaseFields {
    readonly qrCodeBase64Data?: string;
    readonly isLightMode: boolean;
}

export interface IProfileState {
    readonly userProfile: IProfile | null;
    readonly revokingPermissions?: 'loading' | 'complete';
}

// TODO: Replace this method with a lookup from the database
export const profileIsValid = (profile: IAttendeeBaseFields | null): boolean => {
    return profile !== null &&
        validNonEmptyString(profile.companyName) &&
        validNonEmptyString(profile.position) &&
        validNonEmptyString(profile.description);
}

export function isProfile(toTest: IAttendee | IProfile): boolean {
    return 'qrCodeBase64Data' in toTest;
}

const initialProfileState: IProfileState = {
    userProfile: null,
    revokingPermissions: undefined,
};

// Actions
export interface IUpdateProfileAction extends Action<'UpdateProfile'> {
    updates: IUpdateProfileFields
}

export interface IUpdatePreferredUiModeAction extends Action<'UpdatePreferredUiMode'> {
    isLightMode: boolean;
}

export interface IUpdateProfileImageAction extends Action<'UpdateProfileImage'> {
    imageData: string;
}

export interface IRevokingPermissionsAction extends Action<'RevokingPermissions'> {}

export interface IRevokedPermissionsAction extends Action<'RevokedPermissions'> {}

export type AttendeeActions =
    | IUpdateProfileAction
    | IUpdatePreferredUiModeAction
    | IUpdateProfileImageAction
    | IReceivedDataSyncAction
    | IRevokingPermissionsAction
    | IRevokedPermissionsAction
    | ILogoutAction;

// Action Creators
export interface IUpdateProfileFields {
    companyName: string;
    position: string;
    description: string;
    companyDivision: string;
    phoneNumber: string;
    skype: string;
    website: string;
    linkedIn: string;
    address: string;
};

export const updateProfileActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        IUpdateProfileAction  // The type of the last action to be dispatched
    >
> = (updates: IUpdateProfileFields) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        const getDataSyncAction: IUpdateProfileAction = {
            type: 'UpdateProfile',
            updates,
        };

        dispatch(getDataSyncAction);
    };
};

export const updateUiPreferenceActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        IUpdateProfileAction  // The type of the last action to be dispatched
    >
> = (isLightMode: boolean) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        const updatePreferredUiModeAction: IUpdatePreferredUiModeAction = {
            type: 'UpdatePreferredUiMode',
            isLightMode,
        };

        dispatch(updatePreferredUiModeAction);
    };
};

export const updateUserProfilePictureActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        IUpdateProfileAction  // The type of the last action to be dispatched
    >
> = (imageData: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        const updateProfileImageAction: IUpdateProfileImageAction = {
            type: 'UpdateProfileImage',
            imageData,
        };

        dispatch(updateProfileImageAction);
    };
};

export const revokeLoggedInUserPermissionsActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        IUpdateProfileAction  // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        const token: string | undefined = getState().authState.authToken;
        if (token === undefined) {
            throw new Error('Token is not valid');
        }

        dispatch({
            type: 'RevokingPermissions',
        } as IRevokingPermissionsAction);

        await handleApiCall(
            `${process.env.REACT_APP_API_ROOT_URL}Profile/revoke-permissions`,
            token,
            undefined,
            204,
            (data: any) => {
                dispatch({
                    type: 'RevokedPermissions',
                } as IRevokedPermissionsAction);

                dispatch({
                    type: 'Logout',
                    logoutReason: 'revokePermissions',
                } as ILogoutAction);
            },
        )
    };
};

// Reducers
export const profileReducer: Reducer<IProfileState, AttendeeActions> = (
    state = initialProfileState,
    action,
) => {
    switch (action.type) {
        case 'UpdateProfile': {
            if (state.userProfile !== null) {
                return {
                    ...state,
                    userProfile: {
                        ...state.userProfile,
                        companyName: action.updates.companyName,
                        position: action.updates.position,
                        description: action.updates.description,
                        companyDivision: action.updates.companyDivision,
                        linkedInUsername: action.updates.linkedIn,
                        skype: action.updates.skype,
                        website: action.updates.website,
                        address: action.updates.address,
                        phoneNumber: action.updates.phoneNumber,
                    }
                };
            }

            return state;
        }
        case 'ReceivedDataSync': {
            return {
                ...state,
                userProfile: action.myProfile != null ? action.myProfile : state.userProfile,
            };
        }
        case 'UpdatePreferredUiMode': {
            return {
                ...state,
                userProfile: state.userProfile !== null ? {
                    ...state.userProfile,
                    isLightMode: action.isLightMode,
                } : null,
            }
        }
        case 'UpdateProfileImage': {
            return {
                ...state,
                userProfile: state.userProfile !== null ? {
                    ...state.userProfile,
                    profilePictureBase64Data: action.imageData,
                } : null,
            };
        }
        case 'RevokingPermissions': {
            return {
                ...state,
                revokingPermissions: 'loading',
            };
        }
        case 'RevokedPermissions': {
            return {
                ...state,
                revokingPermissions: 'complete',
            };
        }
        case 'Logout': {
            return initialProfileState;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};