import { reducer as reduxFormReducer, FormStateMap } from 'redux-form';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { IAttendeeState, attendeeReducer } from './attendee';
import { IRehydratedState, rehydratedReducer } from './rehydrated';
import { combineReducers, createStore, applyMiddleware, Store, compose } from 'redux';
import { History, createBrowserHistory } from 'history';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import thunk from 'redux-thunk';
import { ISyncState, syncReducer } from './sync';
import { IAuthState, authReducer } from './auth';

// state
export interface IAppState {
    readonly form: FormStateMap;
    readonly router: RouterState;
    readonly rehydrated: IRehydratedState;
    readonly sync: ISyncState;
    readonly attendeesState: IAttendeeState;
    readonly authState: IAuthState;
}

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
}))(history);

const { middleware, enhanceReducer, enhanceStore } = createOffline(offlineConfig);

export function configureStore(): Store<IAppState> {
    // This line is suspect, not sure if this is the middleware required
    const store = createStore(
        enhanceReducer(rootReducer), 
        undefined,
        compose(
            applyMiddleware(middleware, routerMiddleware(history), thunk),
            enhanceStore));

    return store;
}