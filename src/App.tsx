import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, IAppState } from './store/';
import { Store, AnyAction } from 'redux';
import { checkQueueActionCreator } from './store/sync';
import { ThunkDispatch } from 'redux-thunk';
import { updateAvailableActionCreator } from './store/serviceWorker';
import ThemeWrapper from './ThemeWrapper';

const store: Store<IAppState, AnyAction> = configureStore();

// Start the queue checker
(store.dispatch as ThunkDispatch<any, any, AnyAction>)(checkQueueActionCreator());

export const onServiceWorkerUpdateAvailable = () => {
    (store.dispatch as ThunkDispatch<any, any, AnyAction>)(updateAvailableActionCreator());
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ThemeWrapper />
        </Provider>
    );
}

export default App;
