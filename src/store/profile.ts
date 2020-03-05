import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction } from './sync';
import { ILogoutAction } from './auth';
import { IAttendeeBaseFields } from './attendee';
import { validNonEmptyString } from '../util';

// Store
export type UiMode = 'light' | 'dark';
export interface IProfile extends IAttendeeBaseFields {
    readonly qrCodeBase64Data?: string;
    readonly uiMode: UiMode;
}

export interface IProfileState {
    readonly userProfile: IProfile | null;
}

// TODO: Replace this method with a lookup from the database
export const profileIsValid = (profile: IAttendeeBaseFields | null): boolean => {
    return profile !== null &&
        validNonEmptyString(profile.companyName) && validNonEmptyString(profile.companyName) &&
        validNonEmptyString(profile.position) && validNonEmptyString(profile.position);
}

const initialProfileState: IProfileState = {
    userProfile: null,
};

// Actions
export interface IUpdateProfileAction extends Action<'UpdateProfile'> {
    updates: IUpdateProfileFields
}

export interface IUpdatePreferredUiModeAction extends Action<'UpdatePreferredUiMode'> {
    newPreferredMode: UiMode;
}

export type AttendeeActions =
    | IUpdateProfileAction
    | IUpdatePreferredUiModeAction
    | IReceivedDataSyncAction
    | ILogoutAction;

// Action Creators
export interface IUpdateProfileFields {
    companyName: string;
    position: string;
    description: string;
    division: string;
    phone: string;
    skype: string;
    website: string;
    linkedIn: string;
    workAddress: string;
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

export const updateUiPreferenceCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        IUpdateProfileAction  // The type of the last action to be dispatched
    >
> = (preferredMode: UiMode) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        const updatePreferredUiModeAction: IUpdatePreferredUiModeAction = {
            type: 'UpdatePreferredUiMode',
            newPreferredMode: preferredMode,
        };

        dispatch(updatePreferredUiModeAction);
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
                        division: action.updates.division,
                        linkedInUsername: action.updates.linkedIn,
                        skype: action.updates.skype,
                        website: action.updates.website,
                        workAddress: action.updates.workAddress,
                        phone: action.updates.phone,
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
                    uiMode: action.newPreferredMode,
                } : null,
            }
        }
        case 'Logout': {
            return initialProfileState;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};