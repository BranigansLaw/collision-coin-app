import { reducer as reduxFormReducer, FormStateMap } from 'redux-form';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { IAttendeeState, attendeeReducer } from './attendee';
import { IRehydratedState, rehydratedReducer } from './rehydrated';
import { combineReducers, createStore, applyMiddleware, Store, compose, StoreEnhancer } from 'redux';
import { History, createBrowserHistory } from 'history';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import thunk from 'redux-thunk';
import { ISyncState, syncReducer } from './sync';
import { IAuthState, authReducer, ILogoutAction } from './auth';
import { IProfileState, profileReducer } from './profile';
import { AppState as OfflineAppState, OfflineAction } from '@redux-offline/redux-offline/lib/types';

// state
export interface IAppState {
    readonly form: FormStateMap;
    readonly router: RouterState;
    readonly rehydrated: IRehydratedState;
    readonly sync: ISyncState;
    readonly attendeesState: IAttendeeState;
    readonly authState: IAuthState;
    readonly profile: IProfileState;
}

export type IOfflineAppState = IAppState
    & OfflineAppState;

// tslint:disable-next-line:no-empty
export const neverReached = (never: never) => {};

export const history = createBrowserHistory();

const rootReducer = ((history: History) => combineReducers<IAppState>({
    form: reduxFormReducer,
    router: connectRouter(history),
    rehydrated: rehydratedReducer,
    sync: syncReducer,
    attendeesState: attendeeReducer,
    authState: authReducer,
    profile: profileReducer,
}))(history);

let offlineChangedConfig = offlineConfig;
offlineChangedConfig.persistOptions = { 
    blacklist: [ 'form', 'router' ],
};

let storeRef: Store<IAppState> | undefined = undefined;
offlineChangedConfig.discard = (error: any, action: OfflineAction, retries: number) => {
    if (storeRef !== undefined && error && error.status === 401) {
        storeRef.dispatch({
            type: 'Logout',
        } as ILogoutAction);

        return true;
    }

    return error && (
        (error.status >= 200 && error.status < 299) || 
        (error.status === 400)
    );
}

const { middleware, enhanceReducer, enhanceStore } = createOffline(offlineChangedConfig);

export function configureStore(): Store<IAppState> {
    // This line is suspect, not sure if this is the middleware required
    const store = createStore(
        enhanceReducer(rootReducer), 
        undefined,
        compose(
            enhanceStore as StoreEnhancer,
            applyMiddleware(middleware, routerMiddleware(history), thunk)));

    storeRef = store;
    return store;
}