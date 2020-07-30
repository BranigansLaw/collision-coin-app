import React from 'react';
import ReactDOM from 'react-dom';
import App, { onServiceWorkerUpdateAvailable } from './App';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

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
        const waitingServiceWorker = registration.waiting;
        if (waitingServiceWorker) {
            waitingServiceWorker.addEventListener("statechange", () => {
                if (waitingServiceWorker.state === "activated") {
                    onServiceWorkerUpdateAvailable();
                    skipWaitingCall = () => {
                        window.location.reload();
                    };
                }
            });
            waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
        }
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

Sentry.init({
    dsn: "https://8c7645c087144221b749122e5dfef465@o427501.ingest.sentry.io/5371621",
    release: 'conference-quest-app@1.0',
    integrations: [
        new ApmIntegrations.Tracing(),
    ],
    tracesSampleRate: 0.1, // Be sure to lower this in production
});

ReactDOM.render(<App />, document.getElementById('root'));