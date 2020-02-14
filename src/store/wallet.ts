import { Reducer } from 'redux';
import { neverReached, } from '.';
import { IReceivedDataSyncAction } from './sync';
import { ICreateAttendeeCollisionAction } from './attendee';

// Store
export interface IWalletState {
    readonly balance: number;
    readonly addAttendeeCoins: number;
}

const initialProfileState: IWalletState = {
    balance: 0,
    addAttendeeCoins: 0,
};

// Actions

export type AttendeeActions =
    | ICreateAttendeeCollisionAction
    | IReceivedDataSyncAction;

// Action Creators

// Reducers
export const walletReducer: Reducer<IWalletState, AttendeeActions> = (
    state = initialProfileState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            return {
                ...state,
                balance: action.balance !== null ? action.balance : state.balance,
            };
        }
        case 'CreateAttendeeCollision': {
            return {
                ...state,
                balance: state.balance + 500,
                addAttendeeCoins: state.addAttendeeCoins,
            };
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};