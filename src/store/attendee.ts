import { Action, Reducer, ActionCreator, AnyAction } from 'redux';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction, IAuditableEntity } from './sync';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ILogoutAction } from './auth';
import { mergeLists } from '../util';

// Store
export interface IAttendeeBaseFields extends IAuditableEntity {
    id: string;
    firstName: string;
    lastName: string;
    companyName: string | null;
    position: string | null;
    email: string | null;
    description: string | null
    linkedInUsername: string | null;
    companyDivision: string | null;
    phoneNumber: string | null;
    skype: string | null;
    website: string | null;
    address: string | null;
    profilePictureBase64Data: string | null;
}

export interface IAttendee extends IAttendeeBaseFields {
    userNotes: string;
    approvalState: 'New' | 'Block' | 'Approved';
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

export interface IUpdateAttendeeNotesAction extends Action<'UpdateAttendeeNotes'> {
    attendeeId: string;
    updatedNotes: string;
}

export type AttendeeActions =
    | IReceivedDataSyncAction
    | ICreateAttendeeCollisionAction
    | IUpdateAttendeeNotesAction
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

export const updateAttendeeCollisionNotesActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        ICreateAttendeeCollisionAction  // The type of the last action to be dispatched
    >
> = (attendeeId: string, updatedNotes: string) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
        const createAttendeeCollisionAction: IUpdateAttendeeNotesAction = {
            type: 'UpdateAttendeeNotes',
            attendeeId,
            updatedNotes,
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
            return {
                ...state,
                collisions: mergeLists(state.collisions, action.attendeeCollisions),
            };
        }
        case 'CreateAttendeeCollision': {
            return {
                ...state,
                collisions: [ {
                    id: action.attendeeId,
                    firstName: action.firstName,
                    lastName: action.lastName,
                    userNotes: '',
                } as IAttendee, ...state.collisions ]
            };
        }
        case 'UpdateAttendeeNotes': {
            const matchingCollisionQuery: IAttendee[] = state.collisions.filter(c => c.id.toString() === action.attendeeId);

            if (matchingCollisionQuery.length !== 1) {
                return state;
            }

            return {
                ...state,
                collisions: [ 
                    {
                        ...matchingCollisionQuery[0],
                        userNotes: action.updatedNotes,
                    } as IAttendee,
                    ...state.collisions.filter(c => c.id.toString() !== action.attendeeId) ]
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