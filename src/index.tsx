import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

require('dotenv').config();

ReactDOM.render(<App />, document.getElementById('root'));

let skipWaitingCall = () => {};
let updateCall = () => {};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onUpdate: (registration: ServiceWorkerRegistration) => {
        console.log('Update Available!');
        console.log(JSON.stringify(registration));
        const messageQuery = document.getElementById('updateMessage');
        if (messageQuery !== null) {
            messageQuery.classList.add('updated');
        }

        skipWaitingCall = () => {
            if (registration.waiting !== null) {
                console.log('skipWaitingCall() called');
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        };
    },
    onRegister: (registration: ServiceWorkerRegistration, globalServiceWorker: ServiceWorkerGlobalScope) => {
        console.log('Registered!');
        console.log(`registration.active.state = ${registration.active !== null ? registration.active.state : ''}`);
        console.log(`registration.update = ${registration.update}`);
        console.log(`registration.active?.postMessage = ${registration.active !== null ? registration.active.postMessage : ''}`);
        console.log(`updateWaiting = ${registration.waiting !== null ? 'Yes' : 'No'}`);

        skipWaitingCall = () => {
            if (registration.waiting !== null) {
                console.log('skipWaitingCall() called');
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        };

        updateCall = () => {
            console.log('updateCall() called');
            registration.update();
        };
    },
});

export function skipWaiting() {
    if (skipWaitingCall !== undefined) {
        skipWaitingCall();
    }
}

export function update() {
    if (updateCall !== undefined) {
        updateCall();
    }
}