import { Action, Reducer, ActionCreator, AnyAction } from 'redux';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction, IAuditableEntity } from './sync';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ILogoutAction } from './auth';

// Store
export interface IAttendee extends IAuditableEntity {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    position?: string;
    emailAddress?: string;
    linkedInUsername?: string;
}

export interface IAttendeeState {
    readonly collisions: IAttendee[];
}

const initialAttendeeState: IAttendeeState = {
    collisions: [],
};

// Actions
export interface ICreateAttendeeCollisionAction extends Action<'CreateAttendeeCollision'> {
    attendeeId: string;
    firstName: string;
    lastName: string;
}

export type AttendeeActions =
    | IReceivedDataSyncAction
    | ICreateAttendeeCollisionAction
    | ILogoutAction;

// Action Creators
export const createAttendeeCollisionActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        ICreateAttendeeCollisionAction  // The type of the last action to be dispatched
    >
> = (attendeeId: string, firstName: string, lastName: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        const profile = getState().profile.userProfile;
        if ((profile && profile.id.toString() === attendeeId) ||
            getState().attendeesState.collisions.filter(a => a.id === attendeeId).length > 0) {
                return;
        }

        const createAttendeeCollisionAction: ICreateAttendeeCollisionAction = {
            type: 'CreateAttendeeCollision',
            attendeeId,
            firstName,
            lastName,
        };

        dispatch(createAttendeeCollisionAction);
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
            action.attendeeCollisions.forEach(a => newConnections.set(a.id.toString(), a));
            state.collisions.forEach(a => {
                if (!newConnections.has(a.id.toString()) && !a.deleted) {
                    newConnections.set(a.id.toString(), a);
                }
            });

            return {
                ...state,
                collisions: Array.from(newConnections.values()),
            };
        }
        case 'CreateAttendeeCollision': {
            return {
                ...state,
                collisions: [ {
                    id: action.attendeeId,
                    firstName: action.firstName,
                    lastName: action.lastName,
                } as IAttendee, ...state.collisions ]
            };
        }
        case 'Logout': {
            return initialAttendeeState;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};