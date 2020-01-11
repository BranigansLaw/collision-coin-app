import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, IAppState } from './store/';
import { Store, AnyAction } from 'redux';
import RehydrateWrapper from './components/Wrappers/RehydrateWrapper';
import Route from './route';
import { checkQueueActionCreator } from './store/sync';
import { ThunkDispatch } from 'redux-thunk';
import OfflineWrapper from './components/Wrappers/OfflineWrapper';
import ServiceWorkerUpdateWrapper from './components/Wrappers/ServiceWorkerUpdateWrapper';
import { updateAvailableActionCreator } from './store/serviceWorker';

const store: Store<IAppState, AnyAction> = configureStore();

// Start the queue checker
(store.dispatch as ThunkDispatch<any, any, AnyAction>)(checkQueueActionCreator());

export const onServiceWorkerUpdateAvailable = () => {
    (store.dispatch as ThunkDispatch<any, any, AnyAction>)(updateAvailableActionCreator());
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <RehydrateWrapper>
                <OfflineWrapper>
                    <ServiceWorkerUpdateWrapper>
                        <Route />
                    </ServiceWorkerUpdateWrapper>
                </OfflineWrapper>
            </RehydrateWrapper>
        </Provider>
    );
}

export default App;
