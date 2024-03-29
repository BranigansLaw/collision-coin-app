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
import { IAuthState, authReducer } from './auth';
import { IProfileState, profileReducer } from './profile';
import { IWalletState, walletReducer } from './wallet';
import { IServiceWorkerState, serviceWorkerReducer } from './serviceWorker';
import { AppState as OfflineAppState, Config, NetworkCallback } from '@redux-offline/redux-offline/lib/types';
import { ICalendarState, calendarReducer } from './event';
import { IAttendeeRedemptionState, attendeeRedemptionReducer } from './redemption';
import { IAdminState, adminReducer } from './admin';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';

// state
export interface IAppState {
    readonly form: FormStateMap;
    readonly router: RouterState;
    readonly rehydrated: IRehydratedState;
    readonly admin: IAdminState;
    readonly sync: ISyncState;
    readonly attendeesState: IAttendeeState;
    readonly eventState: ICalendarState;
    readonly redemptionState: IAttendeeRedemptionState;
    readonly authState: IAuthState;
    readonly profile: IProfileState;
    readonly wallet: IWalletState;
    readonly serviceWorker: IServiceWorkerState;
}

export type IOfflineAppState = 
    IAppState
    & OfflineAppState;

// tslint:disable-next-line:no-empty
export const neverReached = (never: never) => {};

export const history = createBrowserHistory();

const reactPlugin = new ReactPlugin();
const ai = new ApplicationInsights({
    config: {
        instrumentationKey: process.env.REACT_APP_APPINSIGHTS_KEY,
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: { history: history }
        }
    }
});
ai.loadAppInsights();

export const withAppInsights = (Component: React.ComponentType) => withAITracking(reactPlugin, Component);
export const appInsightsObj = ai.appInsights;

const rootReducer = ((history: History) => combineReducers<IAppState>({
    form: reduxFormReducer,
    router: connectRouter(history),
    rehydrated: rehydratedReducer,
    admin: adminReducer,
    sync: syncReducer,
    attendeesState: attendeeReducer,
    eventState: calendarReducer,
    redemptionState: attendeeRedemptionReducer,
    authState: authReducer,
    profile: profileReducer,
    wallet: walletReducer,
    serviceWorker: serviceWorkerReducer,
}))(history);

let firstLoad: boolean = true;
const offlineAppConfig: Config = {
    ...offlineConfig,
    detectNetwork: (callback: NetworkCallback) => {
        if (firstLoad) {
            firstLoad = false;
            callback(true);
        }
        setInterval(async () => {
            try {
                await fetch(`${process.env.REACT_APP_API_ROOT_URL}Sync/check-online`, { method: 'HEAD' })
                callback(true);
            } catch(e) {
                callback(false);
            }
        }, 2000)
    },    
    persistOptions: { 
        blacklist: [ 'form', 'router', 'serviceWorker', 'admin' ],
    },
};

const { middleware, enhanceReducer, enhanceStore } = createOffline(offlineAppConfig);

export function configureStore(): Store<IAppState> {
    // This line is suspect, not sure if this is the middleware required
    const store = createStore(
        enhanceReducer(rootReducer), 
        undefined,
        compose(
            enhanceStore as StoreEnhancer,
            applyMiddleware(middleware, routerMiddleware(history), thunk)));

    return store;
}