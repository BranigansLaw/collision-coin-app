import { Action, Reducer, ActionCreator, AnyAction } from 'redux';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction, IAuditableEntity } from './sync';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ILogoutAction } from './auth';
import { mergeLists } from '../util';

// Store
export interface IAttendeeRedemption extends IAuditableEntity {
    id: string;
}

export interface IRedeemable {
    id: string;
    name: string;
    cost: number | undefined;
}

export interface IAttendeeRedemptionState {
    readonly redemptions: IAttendeeRedemption[];
    readonly current: IRedeemable | undefined;
}

const initialAttendeeRedemptionState: IAttendeeRedemptionState = {
    redemptions: [],
    current: undefined,
};

// Actions
export interface ISetCurrentRedeemable extends Action<'SetCurrentRedeemable'> {
    newCurrent: IRedeemable;
}

export type AttendeeActions =
    | IReceivedDataSyncAction
    | ISetCurrentRedeemable
    | ILogoutAction;

// Action Creators
export const setCurrentRedeemableActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        ISetCurrentRedeemable // The type of the last action to be dispatched
    >
> = (newCurrent: IRedeemable) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'SetCurrentRedeemable',
            newCurrent: newCurrent,
        } as ISetCurrentRedeemable);
    };
};

// Reducers
export const attendeeRedemptionReducer: Reducer<IAttendeeRedemptionState, AttendeeActions> = (
    state = initialAttendeeRedemptionState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            return {
                ...state,
                redemptions: mergeLists(state.redemptions, action.attendeeCollisions),
            };
        }
        case 'SetCurrentRedeemable': {
            return {
                ...state,
                current: action.newCurrent,
            };
        }
        case 'Logout': {
            return initialAttendeeRedemptionState;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};