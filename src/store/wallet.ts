import { Reducer } from 'redux';
import { neverReached, } from '.';
import { IReceivedDataSyncAction } from './sync';
import { ICreateAttendeeCollisionAction, IUpdateAttendeeApprovalStateAction } from './attendee';
import { INewRedemptionAction } from './redemption';

// Store
interface BonusSettings {
    readonly attendeeCollisionCoinsEarned: number;
    readonly attendeeApprovalCoinsEarned: number;
}

export interface IWalletState {
    readonly balance: number;
    readonly addAttendeeCoins: number;
    readonly bonusSettings: BonusSettings;
}

const initialProfileState: IWalletState = {
    balance: 0,
    addAttendeeCoins: 0,
    bonusSettings: {
        attendeeApprovalCoinsEarned: 0,
        attendeeCollisionCoinsEarned: 0,
    },
};

// Actions

export type AttendeeActions =
    | ICreateAttendeeCollisionAction
    | INewRedemptionAction
    | IReceivedDataSyncAction
    | IUpdateAttendeeApprovalStateAction;

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
                bonusSettings: {
                    attendeeApprovalCoinsEarned: action.appSettings !== null ?
                        action.appSettings.attendeeApprovalCoinsEarned : state.bonusSettings.attendeeApprovalCoinsEarned,
                    attendeeCollisionCoinsEarned: action.appSettings !== null ?
                        action.appSettings.attendeeCollisionCoinsEarned : state.bonusSettings.attendeeCollisionCoinsEarned,
                },
            };
        }
        case 'NewRedemption': {
            return {
                ...state,
                balance: state.balance - action.cost,
            };
        }
        case 'CreateAttendeeCollision': {
            return {
                ...state,
                balance: state.balance + state.bonusSettings.attendeeCollisionCoinsEarned,
                addAttendeeCoins: state.addAttendeeCoins,
            };
        }
        case 'UpdateAttendeeApproval': {
            if (action.currState === 'New' && action.newState === 'Approved') {
                return {
                    ...state,
                    balance: state.balance + state.bonusSettings.attendeeApprovalCoinsEarned,
                    addAttendeeCoins: state.addAttendeeCoins,
                };
            }
            
            return state;
        }
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};