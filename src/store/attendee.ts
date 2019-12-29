import axios from 'axios';
import { Action, ActionCreator, Reducer, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { Guid } from 'guid-typescript';
import { IReceivedDataSyncAction, IAuditableEntity } from './sync';

// Store
export interface IAttendee extends IAuditableEntity {
    id: Guid;
    name: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    position?: string;
    emailAddress?: string;
    linkedInUsername?: string;
    imageLink?: string;
}

export interface IAttendeeState {
    readonly connections: IAttendee[];
    readonly loading: boolean;
}

const initialAttendeeState: IAttendeeState = {
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
    | IGotAttendeeDetailsAction
    | IReceivedDataSyncAction;

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

    attendeeDetails.imageLink = "https://i2.wp.com/tylerfindlay.com/wp-content/uploads/2014/07/cropped-1236380_10100252656487375_106899236_n.jpg";
    
    const gotAttendeeDetailsAction: IGotAttendeeDetailsAction = {
        fullAttendeeDetails: attendeeDetails,
        type: 'GotAttendeeDetails',
    };
    dispatch(gotAttendeeDetailsAction);
  };
};

// Reducers
export const attendeeReducer: Reducer<IAttendeeState, AttendeeActions> = (
    state = initialAttendeeState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            const newConnections: Map<string, IAttendee> = new Map();
            action.attendees.forEach(a => newConnections.set(a.id.toString(), a));
            state.connections.forEach(a => {
                if (!newConnections.has(a.id.toString()) && !a.deleted) {
                    newConnections.set(a.id.toString(), a);
                }
            });

            return {
                ...state,
                connections: Array.from(newConnections.values()),
            };
        }
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
                connections: [...state.connections.filter(a => a.id.toString() !== action.fullAttendeeDetails.id.toString()), action.fullAttendeeDetails],
            };
        }
        default:
        neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};