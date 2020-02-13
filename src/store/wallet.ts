import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IAppState } from '.';
import { IReceivedDataSyncAction } from './sync';
import { ICreateAttendeeCollisionAction } from './attendee';

// Store
export interface IWalletState {
    readonly balance: number;
}

const initialProfileState: IWalletState = {
    balance: 0,
};

// Actions
export interface ITestAction extends Action<'TestAction'> {
}

export type AttendeeActions =
    | ITestAction
    | ICreateAttendeeCollisionAction
    | IReceivedDataSyncAction;

// Action Creators
export const fireTestActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,        // The type of the last action to be dispatched - will always be promise<T> for async actions
        IAppState,            // The type for the data within the last action
        null,                 // The type of the parameter for the nested function 
        ITestAction  // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IAppState) => {
        dispatch({
            type: 'TestAction'
        } as ITestAction);
    };
};

// Reducers
export const walletReducer: Reducer<IWalletState, AttendeeActions> = (
    state = initialProfileState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            return {
                ...state,
                balance: action.balance,
            };
        }
        case 'CreateAttendeeCollision': {
            return {
                ...state,
                balance: state.balance + 500,
            };
        }
        case 'TestAction': {
            return {
                ...state,
                balance: state.balance + 100,
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};