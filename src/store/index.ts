import { reducer as reduxFormReducer, FormStateMap } from 'redux-form';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { IAttendeeState, attendeeReducer } from './attendee';
import { combineReducers, createStore, applyMiddleware, Store, compose } from 'redux';
import { History, createBrowserHistory } from 'history';
import { persistStore, persistReducer, Persistor } from 'redux-persist'
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import { ISyncState, syncReducer } from './sync';

// state
export interface IAppState {
    readonly form: FormStateMap;
    readonly router: RouterState;
    readonly sync: ISyncState;
    readonly attendeesState: IAttendeeState;
}

// tslint:disable-next-line:no-empty
export const neverReached = (never: never) => {};

export const history = createBrowserHistory();

const rootReducer = ((history: History) => combineReducers<IAppState>({
    form: reduxFormReducer,
    router: connectRouter(history),
    sync: syncReducer,
    attendeesState: attendeeReducer,
}))(history);

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['form', 'router'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureStore(): [Store<IAppState>, Persistor] {
    // This line is suspect, not sure if this is the middleware required
    const store = createStore(
        persistedReducer, 
        undefined,
        compose(
            applyMiddleware(routerMiddleware(history), thunk),
            offline(offlineConfig)));

    const persistor = persistStore(store);

    return [store, persistor];
}