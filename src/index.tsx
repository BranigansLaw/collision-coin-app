import React from 'react';
import ReactDOM from 'react-dom';
import App, { onServiceWorkerUpdateAvailable } from './App';
import * as serviceWorker from './serviceWorker';

require('dotenv').config();

let skipWaitingCall = () => {};
let checkForUpdatesCall = () => {};

const skipWaitingImp = (registration: ServiceWorkerRegistration) => {
    if (registration.waiting !== null) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    }
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onUpdate: (registration: ServiceWorkerRegistration) => {
        onServiceWorkerUpdateAvailable();

        skipWaitingCall = () => {
            skipWaitingImp(registration);
        };
    },
    onRegister: (registration: ServiceWorkerRegistration) => {
        skipWaitingCall = () => {
            skipWaitingImp(registration);
        };

        checkForUpdatesCall = () => {
            registration.update();
        };
    },
});

export const skipWaiting = () => {
    if (skipWaitingCall !== undefined) {
        skipWaitingCall();
    }
}

const checkForUpdates = () => {
    if (checkForUpdatesCall !== undefined) {
        checkForUpdatesCall();
    }
}

setInterval(() => checkForUpdates(), 30000);
checkForUpdates();

ReactDOM.render(<App />, document.getElementById('root'));