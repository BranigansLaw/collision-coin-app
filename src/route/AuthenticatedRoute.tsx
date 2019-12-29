import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { RootUrls } from '.';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { profileIsValid } from '../store/profile';
import { startSyncIntervalActionCreator } from '../store/sync';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    isAuthenticated: boolean;
    firstSyncRequired: boolean;
    profileDataValid: boolean;
    startSync: () => void;
}

const AuthenticatedRoute = ({
    component: Component,
    isAuthenticated,
    firstSyncRequired,
    profileDataValid,
    startSync,
    ...rest 
}: IProps) => (
    <Route {...rest} render={(props) => {
        if (isAuthenticated) {
            startSync();
            if (!firstSyncRequired) {
                if (profileDataValid) {
                    if (window.location.pathname === RootUrls.firstDataSync()) {
                        return <Redirect to={RootUrls.dashboard()} />;
                    }
                    else {
                        return <Component {...props} />;
                    }
                }
                else {
                    if (window.location.pathname !== RootUrls.userProfile()) {
                        return <Redirect to={RootUrls.userProfile()} />;
                    }
                    else {
                        return <Component {...props} />;
                    }
                }
            }
            else {
                if (window.location.pathname !== RootUrls.firstDataSync()) {
                    return <Redirect to={RootUrls.firstDataSync()} />;
                }
                else {
                    return <Component {...props} />;
                }
            }
        }
        else {
            return <Redirect to={RootUrls.login()} />;
        }
    }} />
)

const mapStateToProps = (store: IAppState) => {
    return {
        isAuthenticated: store.authState.authToken !== undefined,
        firstSyncRequired: store.sync.lastSyncEpochMilliseconds === 0,
        profileDataValid: profileIsValid(store.profile.userProfile),
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        startSync: () => dispatch(startSyncIntervalActionCreator()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AuthenticatedRoute);