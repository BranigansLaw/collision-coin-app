import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { startSyncIntervalActionCreator, stopSyncIntervalActionCreator } from '../store/sync';

interface IProps {
    children: React.ReactNode;
    currentlySyncing: boolean;
    lastSyncEpochMilliseconds: number;
    authToken: string | undefined;
    timerExists: boolean;
    startSync: () => void,
    stopSync: () => void,
}

const SyncWrapper: React.FC<IProps> = ({
    children,
    currentlySyncing,
    lastSyncEpochMilliseconds,
    authToken,
    timerExists,
    startSync,
    stopSync,
}) => {
    if (authToken !== undefined && !timerExists) {
        startSync();
    }
    else if (authToken === undefined && timerExists) {
        stopSync();
    }

    if (currentlySyncing && lastSyncEpochMilliseconds === 0) {
        return (<div>Loading</div>);
    }
    else {
        return (
            <>{children}</>
        );
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        currentlySyncing: store.sync.currentlySyncing,
        lastSyncEpochMilliseconds: store.sync.lastSyncEpochMilliseconds,
        authToken: store.authState.authToken,
        timerExists: store.sync.timer !== undefined,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        startSync: () => dispatch(startSyncIntervalActionCreator()),
        stopSync: () => dispatch(stopSyncIntervalActionCreator()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SyncWrapper);