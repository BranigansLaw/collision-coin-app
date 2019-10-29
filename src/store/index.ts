import { reducer as reduxFormReducer, FormStateMap } from 'redux-form';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import { IPeopleState, peopleReducer } from './people';
import { combineReducers, createStore, applyMiddleware, Store } from 'redux';
import { History, createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

// state
export interface IAppState {
    readonly form: FormStateMap;
    readonly router: RouterState;
    readonly peopleState: IPeopleState;
}

// tslint:disable-next-line:no-empty
export const neverReached = (never: never) => {};

const rootReducer = (history: History) => combineReducers<IAppState>({
    form: reduxFormReducer,
    router: connectRouter(history),
    peopleState: peopleReducer,
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