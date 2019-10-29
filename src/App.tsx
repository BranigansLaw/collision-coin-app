import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, IAppState } from './store/';
import { Store, AnyAction } from 'redux';
import Route from './route';

const store: Store<IAppState, AnyAction> = configureStore();

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Route />
        </Provider>
    );
}

export default App;
