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
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import { CssBaseline } from '@material-ui/core';

const store: Store<IAppState, AnyAction> = configureStore();

// Start the queue checker
(store.dispatch as ThunkDispatch<any, any, AnyAction>)(checkQueueActionCreator());

export const onServiceWorkerUpdateAvailable = () => {
    (store.dispatch as ThunkDispatch<any, any, AnyAction>)(updateAvailableActionCreator());
};

const App: React.FC = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Provider store={store}>
                <RehydrateWrapper>
                    <OfflineWrapper>
                        <ServiceWorkerUpdateWrapper>
                            <Route />
                        </ServiceWorkerUpdateWrapper>
                    </OfflineWrapper>
                </RehydrateWrapper>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;
