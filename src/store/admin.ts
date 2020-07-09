import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction } from './sync';
import { Guid } from 'guid-typescript';
import { mergeLists } from '../util';
import { handleApiCall } from './apiTransactionHandler';
import { IConference } from './profile';

// Store
export interface IAdminData {
    conferences: IConference[];
}

export interface IAdminState {
    conferences: IConference[];
    newAttendeeQrCodeData: string | undefined;
    sendingAttendee: boolean;
    errorCreatingAttendee: boolean;
}

const initialAdminState: IAdminState = {
    conferences: [],
    newAttendeeQrCodeData: undefined,
    sendingAttendee: false,
    errorCreatingAttendee: false,
};

// Actions
export interface ISendingNewAttendeeAction extends Action<'SendingNewAttendee'> {}

export interface ISuccessCreatingAttendeeAction extends Action<'SuccessCreatingAttendee'> {
    newAttendeeQrCode: string;
}

export interface IErrorCreatingAttendeeAction extends Action<'ErrorCreatingAttendee'> {}

export type AdminActions =
    | IReceivedDataSyncAction
    | ISendingNewAttendeeAction
    | ISuccessCreatingAttendeeAction
    | IErrorCreatingAttendeeAction;

// Action Creators
export const createAttendeeActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,                 // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                     // The type for the data within the last action
        null,                          // The type of the parameter for the nested function 
        ISuccessCreatingAttendeeAction // The type of the last action to be dispatched
    >
> = (firstName: string, lastName: string, email: string, conferenceId: Guid) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'SendingNewAttendee',
        } as ISendingNewAttendeeAction);

        await handleApiCall(
            `${process.env.REACT_APP_API_ROOT_URL}Attendee/add-attendee-with-conference`,
            getState,
            {
                conferenceId: conferenceId.toString(),
                firstName: firstName,
                lastName: lastName,
                email: email,
            },
            201,
            false,
            (data: any) => {
                dispatch({
                    type: 'SuccessCreatingAttendee',
                    newAttendeeQrCode: data.newAttendeeQrCodeData,
                } as ISuccessCreatingAttendeeAction);
            },
            (error: any) => {
                dispatch({
                    type: 'ErrorCreatingAttendee',
                } as IErrorCreatingAttendeeAction);
            },
        );
    };
};

// Reducers
export const adminReducer: Reducer<IAdminState, AdminActions> = (
    state = initialAdminState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            if (action.adminData) {
                return {
                    ...state,
                    conferences: mergeLists(state.conferences, action.adminData.conferences),
                };
            }
            else {
                return state;
            }
        }
        case 'SendingNewAttendee': {
            return {
                ...state,
                sendingAttendee: true,
                errorCreatingAttendee: false,
            };
        }
        case 'SuccessCreatingAttendee': {
            return {
                ...state,
                sendingAttendee: false,
                errorCreatingAttendee: false,
                newAttendeeQrCodeData: action.newAttendeeQrCode,
            };
        }
        case 'ErrorCreatingAttendee': {
            return {
                ...state,
                sendingAttendee: false,
                errorCreatingAttendee: true,
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};