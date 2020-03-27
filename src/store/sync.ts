import { ActionCreator, Reducer, AnyAction, Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { neverReached, IOfflineAppState } from '.';
import axios, { AxiosResponse } from 'axios';
import { IAttendee, ICreateAttendeeCollisionAction, IUpdateAttendeeNotesAction } from './attendee';
import { IProfile, IUpdateProfileImageAction, IUpdatePreferredUiModeAction } from './profile';
import { ILogoutAction, ILoginThirdPartySuccessAction, IRegisterSuccessAction, ILoginSuccessAction } from './auth';
import { OfflineAction } from '@redux-offline/redux-offline/lib/types';
import { Guid } from 'guid-typescript';
import { getCurrentTimeEpochMilliseconds } from '../util';
import { IUpdateProfileAction } from './profile';
import { IEvent } from './event';
import { IAttendeeRedemption, INewRedemptionAction } from './redemption';
import { IAdminData } from './admin';

// Store
export interface ISyncState {
    readonly lastSyncEpochMilliseconds: number;
    readonly syncIntervalMilliseconds: number;
    readonly actionQueue: ApiAction<ApiActions>[];
}

interface ILogoutRequeueAction extends Action<'LogoutRequeue'> {}

export type ApiActions = 
    | IDataSyncAction
    | IUpdateProfileAction
    | IUpdateProfileImageAction
    | IUpdatePreferredUiModeAction
    | IUpdateAttendeeNotesAction
    | ICreateAttendeeCollisionAction
    | INewRedemptionAction
    | ILogoutRequeueAction;

export class ApiAction<A extends ApiActions> {
    readonly timeEpochMilliseconds: number;
    readonly transactionId: string;
    readonly meta: A;
    numTries: number;

    constructor(meta: A) {
        this.timeEpochMilliseconds = getCurrentTimeEpochMilliseconds();
        this.numTries = 0;
        this.transactionId = Guid.create().toString();
        this.meta = meta;
    }
}

const wrapResponse = async (axiosPromise: Promise<AxiosResponse<any> | undefined>, dispatch: ThunkDispatch<any, any, AnyAction>): Promise<AxiosResponse<any> | undefined> => {
    try {
        const res: AxiosResponse<any> | undefined = await axiosPromise;
        return res;
    }
    catch (e) {
        if (e.isAxiosError && e.response.status === 401) {
            dispatch({
                type: 'Logout',
                logoutReason: 'expiry',
            } as ILogoutAction);
            return undefined;
        }

        return undefined;
    }
}

export const handleApiAction = async (
    action: ApiAction<ApiActions>,
    getState: () => IOfflineAppState,
    dispatch: ThunkDispatch<any, any, AnyAction>) => {
    let res: AxiosResponse<any> | undefined = undefined;
    const headers = {
        'Access-Control-Allow-Origin': '*',
        authorization: `Bearer ${getState().authState.authToken}`,
        TransactionId: action.transactionId.toString(),
    };

    try {
        switch (action.meta.type) {
            case 'DataSync':
                if (getState().sync.actionQueue.filter(a => a.meta.type !== action.meta.type).length > 0 ||
                    getState().authState.authToken === undefined) {
                    // Pretend the sync was successful, and skip for now. There are actions that need to be processed
                    return {
                        status: 200
                    } as AxiosResponse;
                }

                res = await wrapResponse(axios.get(
                    `${process.env.REACT_APP_API_ROOT_URL}sync/${getState().sync.lastSyncEpochMilliseconds}`,
                    {
                        headers
                    }), dispatch);

                if (getState().sync.actionQueue.filter(a => a.meta.type !== action.meta.type).length > 0 ||
                    getState().authState.authToken === undefined) {
                    // Pretend the sync was successful
                    return {
                        status: 200
                    } as AxiosResponse;
                }    
                    
                if (res !== undefined) {
                    try {
                        dispatch({
                            type: 'ReceivedDataSync',
                            adminData: res.data.adminData,
                            attendeeCollisions: res.data.attendeeCollisions,
                            attendeeRedemptions: res.data.redemptions,
                            events: res.data.events,
                            myProfile: res.data.myProfile,
                            balance: res.data.myWallet !== null ? res.data.myWallet.balance : null,
                            addAttendeeCoins: res.data.appSettings !== null ? res.data.appSettings.attendeeCollisionCoinsEarned : null,
                            syncIntervalMilliseconds: res.data.appSettings !== null ? res.data.appSettings.syncIntervalMilliseconds : null,
                            epochUpdateTimeMilliseconds: res.data.epochUpdateTimeMilliseconds,
                        } as IReceivedDataSyncAction);
                    } catch (ex) {
                        debugger;
                    }
                }
                break;
            case 'UpdateProfile':
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}profile/update`,
                    {
                        newCompanyName: action.meta.updates.companyName,
                        newPosition: action.meta.updates.position,
                        newDescription: action.meta.updates.description,
                        newCompanyDivision: action.meta.updates.companyDivision,
                        newLinkedInUsername: action.meta.updates.linkedIn,
                        newSkype: action.meta.updates.skype,
                        newWebsite: action.meta.updates.website,
                        newAddress: action.meta.updates.address,
                        newPhone: action.meta.updates.phoneNumber,
                    },
                    {
                        headers
                    }), dispatch);
                break;
            case 'UpdateProfileImage': {
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}profile/update/photo`,
                    {
                        imageData: action.meta.imageData,
                    },
                    {
                        headers
                    }), dispatch);
                break;
            }
            case 'UpdatePreferredUiMode': {
                    res = await wrapResponse(axios.post(
                        `${process.env.REACT_APP_API_ROOT_URL}profile/update/ui-mode`,
                        {
                            isLightMode: action.meta.isLightMode,
                        },
                        {
                            headers
                        }), dispatch);
                    break;
                }
            case 'UpdateAttendeeNotes':
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}collision/attendee/${action.meta.attendeeId.toString()}/update`,
                    {
                        updatedNotes: action.meta.updatedNotes
                    },
                    {
                        headers
                    }), dispatch);
                break;
            case 'CreateAttendeeCollision':
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}collision/attendee`,
                    {
                        toUserId: action.meta.attendeeId,
                    },
                    {
                        headers
                    }), dispatch);
                break;
            case 'NewRedemption':
                res = await wrapResponse(axios.post(
                    `${process.env.REACT_APP_API_ROOT_URL}redeemable/redeem/${action.meta.redeemableId}`,
                    {
                        amount: action.meta.sendCost ? action.meta.cost : undefined,
                        appRedemptionId: action.meta.appRedemptionId,
                    },
                    {
                        headers
                    }), dispatch);
                break;
            case 'LogoutRequeue':
                dispatch(action.meta);

                // The final nuclear clear
                localStorage.clear();
                break;
            default:
                neverReached(action.meta); // when a new action is created, this helps us remember to handle it in the reducer
        }
    }
    catch (e) {
        res = e.response;
    }

    return res;
};

const initialSyncState: ISyncState = {
    lastSyncEpochMilliseconds: 0,
    syncIntervalMilliseconds: 1000000,
    actionQueue: [],
};

export interface IAuditableEntity {
    deleted?: boolean;
}

// Actions
interface IDataSyncAction extends OfflineAction {
    type: 'DataSync';
}

export interface IClearSyncStateAction extends Action<'ClearSyncState'> {}

interface IDequeueAction extends Action<'Deque'> {
    toDequeue: ApiAction<ApiActions>[];
}

interface IIncrementNumTries extends Action<'IncrementTries'> {
    toIncrementTransactionId: string;
}

export interface IReceivedDataSyncAction extends Action<'ReceivedDataSync'> {
    adminData: IAdminData | undefined;
    attendeeCollisions: IAttendee[];
    attendeeRedemptions: IAttendeeRedemption[];
    events: IEvent[];
    myProfile: IProfile;
    balance: number | null;
    addAttendeeCoins: number | null;
    syncIntervalMilliseconds: number | null;
    epochUpdateTimeMilliseconds: number;
}

export type SyncActions =
    | IDequeueAction
    | IClearSyncStateAction
    | IIncrementNumTries
    | IReceivedDataSyncAction
    | ILogoutAction
    | ApiActions
    | ILoginSuccessAction
    | IRegisterSuccessAction
    | ILoginThirdPartySuccessAction;

export const checkQueueActionCreator: ActionCreator<
    ThunkAction<
        Promise<void>,     // The type of the last action to be dispatched - will always be promise<T> for async actions
        IOfflineAppState,  // The type for the data within the last action
        null,              // The type of the parameter for the nested function 
        IDataSyncAction    // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IOfflineAppState) => {
        console.log('Check data queue');
        try {
            if (getState().offline.online) {
                let completedActions: ApiAction<ApiActions>[] = [];
                let failedActions: ApiAction<ApiActions>[] = [];

                for (const action of getState().sync.actionQueue) {
                    const res: AxiosResponse<any> | undefined =
                        await handleApiAction(action, getState, dispatch);

                    if (res !== undefined && res.status === 401) {
                        // break immediately and logout
                    }
                    if (res !== undefined && (res.status >= 200 && res.status < 300)) {
                        completedActions.push(action);
                    }
                    if (res !== undefined && (res.status === 400)) {
                        // rollback somehow
                    }
                    else {
                        failedActions.push(action);
                    }
                }

                for (const action of failedActions) {
                    dispatch({
                        type: 'IncrementTries',
                        toIncrementTransactionId: action.transactionId,
                    } as IIncrementNumTries);
                }

                dispatch({
                    type: 'Deque',
                    toDequeue: completedActions,
                } as IDequeueAction);

                if (getState().authState.authToken !== undefined && 
                (
                    completedActions.filter(a => a.meta.type !== 'DataSync').length > 0 ||
                    getCurrentTimeEpochMilliseconds() - getState().sync.lastSyncEpochMilliseconds > getState().sync.syncIntervalMilliseconds
                ) && getState().sync.actionQueue.filter(a => a.meta.type === 'DataSync').length === 0) {
                    dispatch({
                        type: 'DataSync',
                    } as IDataSyncAction);
                }
            }
        }
        catch (e) {
            console.error(e);
        }

        setTimeout(() => dispatch(checkQueueActionCreator()), 5000);
    };
};

export const clearSyncStateActionCreator: ActionCreator<
    ThunkAction<
        void,     // The type of the last action to be dispatched - will always be promise<T> for async actions
        IOfflineAppState,  // The type for the data within the last action
        null,              // The type of the parameter for the nested function 
        IDataSyncAction    // The type of the last action to be dispatched
    >
> = () => {
    return async (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => IOfflineAppState) => {
        dispatch({
            type: 'ClearSyncState',
        } as IClearSyncStateAction);
    };
};

// Reducers
export const syncReducer: Reducer<ISyncState, SyncActions> = (
    state = initialSyncState,
    action,
) => {
    switch (action.type) {
        case 'ReceivedDataSync': {
            return {
                ...state,
                lastSyncEpochMilliseconds: action.epochUpdateTimeMilliseconds,
                syncIntervalMilliseconds: action.syncIntervalMilliseconds !== null ? action.syncIntervalMilliseconds : state.syncIntervalMilliseconds,
            };
        }
        case 'ClearSyncState': {
            return initialSyncState;
        }
        case 'Logout': {
            return {
                ...initialSyncState,
                actionQueue: [ new ApiAction<ILogoutRequeueAction>({
                    type: 'LogoutRequeue',
                } as ILogoutRequeueAction) ]
            };
        }
        case 'LogoutRequeue': {
            return initialSyncState;
        }
        case 'DataSync': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<IDataSyncAction>(action) ],
            }
        }
        case 'CreateAttendeeCollision': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<ICreateAttendeeCollisionAction>(action) ],
            }
        }
        case 'UpdateProfile': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue.filter(a => a.meta.type !== 'UpdateProfile'), new ApiAction<IUpdateProfileAction>(action) ],
            }
        }
        case 'UpdateProfileImage': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue.filter(a => a.meta.type !== 'UpdateProfileImage'), new ApiAction<IUpdateProfileImageAction>(action) ],
            }
        }
        case 'UpdatePreferredUiMode': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue.filter(a => a.meta.type !== 'UpdatePreferredUiMode'), new ApiAction<IUpdatePreferredUiModeAction>(action) ],
            }
        }
        case 'UpdateAttendeeNotes': {
            return {
                ...state,
                actionQueue: [ 
                    ...state.actionQueue.filter(q => q.meta.type !== 'UpdateAttendeeNotes' || q.meta.attendeeId !== action.attendeeId), 
                    new ApiAction<IUpdateAttendeeNotesAction>(action)
                ],
            }
        }
        case 'NewRedemption': {
            return {
                ...state,
                actionQueue: [ 
                    ...state.actionQueue.filter(q => q.meta.type !== 'NewRedemption' || q.meta.appRedemptionId !== action.appRedemptionId), 
                    new ApiAction<INewRedemptionAction>(action)
                ],
            }
        }
        case 'Deque': {
            return {
                ...state,
                actionQueue: [ ...state.actionQueue.filter(a => action.toDequeue.filter(a1 => a.transactionId.toString() === a1.transactionId.toString()).length === 0) ]
            };
        }
        case 'IncrementTries': {
            const updatedQueue = state.actionQueue.map(a => {
                if (a.transactionId.toString() === action.toIncrementTransactionId.toString()) {
                    a.numTries++;
                }

                return a;
            });

            return {
                ...state,
                actionQueue: [ ...updatedQueue ]
            };
        }
        case 'LoginSuccess':
        case 'LoginThirdPartySuccess':
        case 'RegisterSuccess':
            return {
                ...state,
                actionQueue: [ ...state.actionQueue, new ApiAction<IDataSyncAction>({
                    type: 'DataSync'
                } as IDataSyncAction) ]
            };
        default:
            neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};