import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, IAppState } from './store/';
import { Store, AnyAction } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'
import Route from './route';

const [store, persistor]: [Store<IAppState, AnyAction>, Persistor] = configureStore();

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Route />
            </PersistGate>
        </Provider>
    );
}

export default App;
