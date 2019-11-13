import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, IAppState } from './store/';
import { Store, AnyAction } from 'redux';
import RehydrateWrapper from './components/RehydrateWrapper';
import Route from './route';

const store: Store<IAppState, AnyAction> = configureStore();

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <RehydrateWrapper>
                <Route />
            </RehydrateWrapper>
        </Provider>
    );
}

export default App;
