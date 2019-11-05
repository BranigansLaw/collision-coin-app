import { reducer as reduxFormReducer, FormStateMap } from 'redux-form';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { IAttendeeState, attendeeReducer } from './attendee';
import { combineReducers, createStore, applyMiddleware, Store } from 'redux';
import { History, createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

// state
export interface IAppState {
    readonly form: FormStateMap;
    readonly router: RouterState;
    readonly attendeesState: IAttendeeState;
}

// tslint:disable-next-line:no-empty
export const neverReached = (never: never) => {};

const rootReducer = (history: History) => combineReducers<IAppState>({
    form: reduxFormReducer,
    router: connectRouter(history),
    attendeesState: attendeeReducer,
});

export const history = createBrowserHistory();

export function configureStore(): Store<IAppState> {
    // This line is suspect, not sure if this is the middleware required
    const store = createStore(
        rootReducer(history), 
        undefined, 
        applyMiddleware(routerMiddleware(history), thunk));

    return store;
}