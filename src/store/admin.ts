import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction } from './sync';
import { Guid } from 'guid-typescript';
import { mergeLists } from '../util';

// Store
export interface IConference {
    id: string;
    name: string;
}

export interface IAdminData {
    conferences: IConference[];
}

export interface IAdminState {
    conferences: IConference[];
    sendingAttendee: boolean;
}

const initialAdminState: IAdminState = {
    conferences: [],
    sendingAttendee: false,
};

// Actions
export interface ISendingNewAttendeeAction extends Action<'SendingNewAttendee'> {}

export interface ISuccessCreatingAttendeeAction extends Action<'SuccessCreatingAttendee'> {}

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
    };
};

// Reducers
export const adminReducer: Reducer<IAdminState, AdminActions> = (
    state = initialAdminState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            return {
                ...state,
                conferences: mergeLists(state.conferences, action.adminData.conferences),
            };
        }
        case 'SendingNewAttendee': {
            return {
                ...state,
                sendingAttendee: true,
            };
        }
        case 'SuccessCreatingAttendee': {
            return {
                ...state,
            };
        }
        case 'ErrorCreatingAttendee': {
            return {
                ...state,
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};