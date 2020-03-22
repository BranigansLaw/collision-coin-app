import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { clearSyncStateActionCreator } from '../../store/sync';

interface IProps  {
    isSynced: boolean;
    isAuthenticated: boolean;
    hasProfile: boolean;
    clearSyncState: () => void;
    children: React.ReactNode;
}

const LocalDataIntegrityCheck: React.FC<IProps> = ({
    isSynced,
    isAuthenticated,
    hasProfile,
    clearSyncState,
    children,
}) => {
    if ((isSynced && !hasProfile) ||
        (isAuthenticated && !hasProfile)) {
        clearSyncState();
    }

    return (
        <>
            {children}
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        isSynced: store.sync.lastSyncEpochMilliseconds !== 0,
        isAuthenticated: store.authState.authToken !== undefined,
        hasProfile: store.profile.userProfile !== null,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        clearSyncState: () => dispatch(clearSyncStateActionCreator()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LocalDataIntegrityCheck);