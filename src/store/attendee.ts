import { Action, Reducer, ActionCreator, AnyAction } from 'redux';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction, IAuditableEntity } from './sync';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ILogoutAction } from './auth';
import { mergeLists } from '../util';
import { nowBetweenEpochs, getCurrentTimeEpochMilliseconds } from '../epochConverter';

// Store
export type ApprovalState = 'New' | 'Block' | 'Approved';

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
    approvalState: ApprovalState;
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
    timeOfConnectionEpochMilliseconds: number;
    conferenceIdConnectionMadeAt: string;
}

export interface IUpdateAttendeeNotesAction extends Action<'UpdateAttendeeNotes'> {
    attendeeId: string;
    updatedNotes: string;
}

export interface IUpdateAttendeeApprovalStateAction extends Action<'UpdateAttendeeApproval'> {
    attendeeId: string;
    currState: ApprovalState;
    newState: ApprovalState;
    timeOfUpdateEpochMilliseconds: number;
    conferenceIdUpdateMadeAt: string;
}

export type AttendeeActions =
    | IReceivedDataSyncAction
    | ICreateAttendeeCollisionAction
    | IUpdateAttendeeNotesAction
    | IUpdateAttendeeApprovalStateAction
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

        // Change this so the user selects with conference they are at
        const conferencesCurrentlyAttending = 
            getState().profile.conferences.filter(c => nowBetweenEpochs(c.startEpochMilliseconds, c.endEpochMilliseconds));

        if (conferencesCurrentlyAttending.length === 0) {
            return;
        }

        const createAttendeeCollisionAction: ICreateAttendeeCollisionAction = {
            type: 'CreateAttendeeCollision',
            attendeeId,
            firstName,
            lastName,
            timeOfConnectionEpochMilliseconds: getCurrentTimeEpochMilliseconds(),
            conferenceIdConnectionMadeAt: conferencesCurrentlyAttending[0].id,
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

export const updateAttendeeCollisionApprovalStateActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        IUpdateAttendeeApprovalStateAction  // The type of the last action to be dispatched
    >
> = (attendeeId: string, newState: ApprovalState) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        debugger;
        // Change this so the user selects with conference they are at
        const conferencesCurrentlyAttending = 
            getState().profile.conferences.filter(c => nowBetweenEpochs(c.startEpochMilliseconds, c.endEpochMilliseconds));

        if (conferencesCurrentlyAttending.length === 0) {
            return;
        }
    
        const updateAttendeeApprovalStateAction: IUpdateAttendeeApprovalStateAction = {
            type: 'UpdateAttendeeApproval',
            attendeeId,
            currState: getState().attendeesState.collisions.filter(c => c.id === attendeeId)[0].approvalState,
            newState,
            conferenceIdUpdateMadeAt: conferencesCurrentlyAttending[0].id,
            timeOfUpdateEpochMilliseconds: getCurrentTimeEpochMilliseconds(),
        };

        dispatch(updateAttendeeApprovalStateAction);
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
                    approvalState: 'Approved',
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
        case 'UpdateAttendeeApproval': {
            const matchingCollisionQuery: IAttendee[] = state.collisions.filter(c => c.id.toString() === action.attendeeId);

            if (matchingCollisionQuery.length !== 1) {
                return state;
            }

            const newValue: IAttendee = matchingCollisionQuery[0];
            newValue.approvalState = action.newState;

            if (action.newState === 'Block') {
                newValue.companyDivision = null;
                newValue.companyName = null;
                newValue.description = null;
                newValue.email = null;
                newValue.linkedInUsername = null;
                newValue.phoneNumber = null;
                newValue.position = null;
                newValue.profilePictureBase64Data = null;
                newValue.skype = null;
                newValue.website = null;
            }

            return {
                ...state,
                collisions: [ 
                    {
                        ...newValue,
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