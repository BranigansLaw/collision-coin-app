import axios from 'axios';
import { Action, ActionCreator, Reducer, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { Guid } from 'guid-typescript';

// Store
export interface IAttendee {
    id: Guid;
    name: string;
    companyName?: string;
    position?: string;
    email?: string;
    linkedInUserName?: string;
}

export interface IAttendeeState {
    readonly connections: IAttendee[];
    readonly loading: boolean;
}

const initialPeopleState: IAttendeeState = {
    connections: [],
    loading: false,
};

// Actions
export interface IGettingAttendeeDetailsAction extends Action<'GettingAttendeeDetails'> {
    attendeeId: Guid;
    name: string;
}

export interface IGotAttendeeDetailsAction extends Action<'GotAttendeeDetails'> {
    fullAttendeeDetails: IAttendee;
}

export type AttendeeActions =
    | IGettingAttendeeDetailsAction
    | IGotAttendeeDetailsAction;

// Action Creators
export const scanAttendeeActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,              // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,                  // The type for the data within the last action
        null,                       // The type of the parameter for the nested function 
        IGotAttendeeDetailsAction   // The type of the last action to be dispatched
    >
> = (attendeeId: Guid, scannedName: string) => {
  return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
    const gettingAttendeeDetails: IGettingAttendeeDetailsAction = {
        type: 'GettingAttendeeDetails',
        attendeeId,
        name: scannedName,
    };
    dispatch(gettingAttendeeDetails);

    await (new Promise((resolve) => setTimeout(resolve, 5000)));

    const attendeeDetails = (await axios.get<IAttendee>(
        'https://collisioncoinservices.tyficonsulting.com/api/Attendee/' + attendeeId,
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        })).data;
    
    const gotAttendeeDetailsAction: IGotAttendeeDetailsAction = {
        fullAttendeeDetails: attendeeDetails,
        type: 'GotAttendeeDetails',
    };
    dispatch(gotAttendeeDetailsAction);
  };
};

// Reducers
export const attendeeReducer: Reducer<IAttendeeState, AttendeeActions> = (
    state = initialPeopleState,
    action,
) => {
    switch (action.type) {
        case 'GettingAttendeeDetails': {   
            return {
                ...state,
                loading: true,
                connections: [...state.connections, { id: action.attendeeId, name: action.name }]
            };
        }
        case 'GotAttendeeDetails': {
            return {
                ...state,
                loading: false,
                connections: [...state.connections.filter(a => a.id !== action.fullAttendeeDetails.id), action.fullAttendeeDetails],
            };
        }
        default:
        neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};