import { Reducer } from 'redux';
import { neverReached } from '.';
import { IReceivedDataSyncAction, IAuditableEntity } from './sync';
import { ILogoutAction } from './auth';
import { mergeLists } from '../util';

// Store
export interface IEvent extends IAuditableEntity {
    readonly id: string;
    readonly name: string;
    readonly location: string;
    readonly description: string;
    readonly startEpochMilliseconds: number;
    readonly endEpochMilliseconds: number;
}

export interface ICalendarState {
    events: IEvent[];
}

const initialProfileState: ICalendarState = {
    events: [],
};

// Actions
export type AttendeeActions =
    | IReceivedDataSyncAction
    | ILogoutAction;

// Action Creators

// Reducers
export const calendarReducer: Reducer<ICalendarState, AttendeeActions> = (
    state = initialProfileState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            return {
                ...state,
                events: mergeLists(state.events, action.events),
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