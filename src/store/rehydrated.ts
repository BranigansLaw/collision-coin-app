import { Reducer } from 'redux';
import { PERSIST_REHYDRATE } from '@redux-offline/redux-offline/lib/constants';

/**
 * This State should only contain the rehydate variable as it gets called outsite react-offline, which means the
 * persisted state will not be ready. If listening for PERSIST_REHYDRATE in a state with other properties, those properties
 * will be overwritten on PERSIST_REHYDRATE with the initialState values
 */

// Store
export interface IRehydratedState {
    readonly rehydrated: boolean;
}

const initialSyncState: IRehydratedState = {
    rehydrated: false,
};

// Actions
export type RehydratedActions = {};

// Action Creators

// Reducers
export const rehydratedReducer: Reducer<IRehydratedState> = (
    state = initialSyncState,
    action,
) => {
    switch (action.type) {
        case PERSIST_REHYDRATE: {
            return {
                rehydrated: true,
            };
        }
    }
    return state;
};