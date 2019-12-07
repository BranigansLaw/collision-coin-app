import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, IAppState } from './store/';
import { Store, AnyAction } from 'redux';
import RehydrateWrapper from './components/RehydrateWrapper';
import SyncWrapper from './components/SyncWrapper';
import Route from './route';

const store: Store<IAppState, AnyAction> = configureStore();

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <RehydrateWrapper>
                <SyncWrapper>
                    <Route />
                </SyncWrapper>
            </RehydrateWrapper>
        </Provider>
    );
}

export default App;
