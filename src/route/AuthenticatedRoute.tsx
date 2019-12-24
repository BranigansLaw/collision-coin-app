import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { RootUrls } from '.';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { profileIsValid } from '../store/profile';

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    isAuthenticated: boolean;
    firstSyncRequired: boolean;
    profileDataValid: boolean;
}

const AuthenticatedRoute = ({
    component: Component,
    isAuthenticated,
    firstSyncRequired,
    profileDataValid,
    ...rest 
}: IProps) => (
    <Route {...rest} render={(props) => {
        if (isAuthenticated) {
            if (!firstSyncRequired) {
                if (profileDataValid) {
                    return <Component {...props} />;
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

export default connect(
    mapStateToProps
)(AuthenticatedRoute);