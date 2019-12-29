import { ActionCreator, Reducer, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { Guid } from 'guid-typescript';
import { IReceivedDataSyncAction } from './sync';
import { OfflineAction } from '@redux-offline/redux-offline/lib/types';
import { ILogoutAction } from './auth';

// Store
export interface IProfile {
    id: Guid;
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    position?: string;
    linkedInUsername?: string;
    imageLink?: string;
}

export interface IProfileState {
    readonly userProfile: IProfile | null;
}

// TODO: Replace this method with a lookup from the database
export const profileIsValid = (profile: IProfile | null): boolean => {
    return profile !== null &&
        profile.companyName !== null && profile.companyName !== undefined &&
        profile.position !== null && profile.position !== undefined;
}

const initialProfileState: IProfileState = {
    userProfile: null,
};

// Actions
interface IUpdateProfileAction extends OfflineAction {
    type: 'UpdateProfile';
    newCompanyName: string;
    newPosition: string;
}

export type AttendeeActions =
    | IUpdateProfileAction
    | IReceivedDataSyncAction
    | ILogoutAction;

// Action Creators
export const updateProfileActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        IUpdateProfileAction  // The type of the last action to be dispatched
    >
> = (companyName: string, position: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        const getDataSyncAction: IUpdateProfileAction = {
            type: 'UpdateProfile',
            newCompanyName: companyName,
            newPosition: position,
            meta: {
                offline: {
                    effect: {
                        url: `${process.env.REACT_APP_API_ROOT_URL}profile/update`,
                        method: 'POST',
                        headers: {
                            authorization: `Bearer ${getState().authState.authToken}`,
                        },
                        body: JSON.stringify({
                            newCompanyName: companyName,
                            newPosition: position,
                        })
                    }
                },
            },
        };

        dispatch(getDataSyncAction);
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
                        companyName: action.newCompanyName,
                        position: action.newPosition,
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
        case 'Logout': {
            return initialProfileState;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};