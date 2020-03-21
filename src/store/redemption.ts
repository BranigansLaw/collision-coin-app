import { Action, Reducer, ActionCreator, AnyAction } from 'redux';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction, IAuditableEntity } from './sync';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ILogoutAction } from './auth';
import { mergeListsWithSelector } from '../util';
import { Guid } from 'guid-typescript';

// Store
export interface IAttendeeRedemption extends IAuditableEntity {
    id: string;
    amount: number;
    redemptionItemName: string;
    used: boolean;
    updatedDateTimeEpochMilliseconds: number;
    appRedemptionId: string;
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
export interface ISetCurrentRedeemableAction extends Action<'SetCurrentRedeemable'> {
    newCurrent: IRedeemable;
}

export interface INewRedemptionAction extends Action<'NewRedemption'> {
    redeemableId: string;
    name: string;
    cost: number;
    appRedemptionId: string;
    sendCost: boolean;
}

export type AttendeeActions =
    | IReceivedDataSyncAction
    | ISetCurrentRedeemableAction
    | INewRedemptionAction
    | ILogoutAction;

// Action Creators
export const setCurrentRedeemableActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        ISetCurrentRedeemableAction // The type of the last action to be dispatched
    >
> = (newCurrent: IRedeemable) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'SetCurrentRedeemable',
            newCurrent: newCurrent,
        } as ISetCurrentRedeemableAction);
    };
};

export const redeemActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        ISetCurrentRedeemableAction // The type of the last action to be dispatched
    >
> = (toRedeem: IRedeemable, appRedemptionId: Guid, cost: number) => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'NewRedemption',
            appRedemptionId: appRedemptionId.toString(),
            name: toRedeem.name,
            redeemableId: toRedeem.id.toString(),
            cost: cost,
            sendCost: toRedeem.cost === undefined,
        } as INewRedemptionAction);
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
                redemptions: mergeListsWithSelector(
                    state.redemptions, 
                    action.attendeeRedemptions,
                    (s: IAttendeeRedemption) => s.appRedemptionId),
            };
        }
        case 'SetCurrentRedeemable': {
            return {
                ...state,
                current: action.newCurrent,
            };
        }
        case 'NewRedemption': {
            return {
                ...state,
                redemptions: [ 
                    {
                        id: Guid.createEmpty().toString(),
                        redemptionItemName: action.name,
                        amount: action.cost,
                        appRedemptionId: action.appRedemptionId,
                    } as IAttendeeRedemption,
                    ...state.redemptions,
                ],
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