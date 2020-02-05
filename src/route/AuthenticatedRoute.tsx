import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { RootUrls } from '.';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { profileIsValid } from '../store/profile';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface IProps extends RouteProps {
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    render?: (props: RouteComponentProps<any>) => React.ReactNode;
    isAuthenticated: boolean;
    firstSyncRequired: boolean;
    profileDataValid: boolean;
    loggedInUserId: string | undefined;
}

const AuthenticatedRoute = ({
    component: Component,
    render,
    isAuthenticated,
    firstSyncRequired,
    profileDataValid,
    loggedInUserId,
    ...rest 
}: IProps) => {
    const componentOrRender = (props: any) => {
        if (render) {
            return render(props);
        }
        else if (Component) {
            return <Component {...props} />
        }
        else {
            throw Error('Either component or render must be defined');
        }
    };

    return (
        <Route {...rest} render={(props) => {
            if (isAuthenticated) {
                if (!firstSyncRequired) {
                    if (profileDataValid) {
                        if (window.location.pathname === RootUrls.firstDataSync()) {
                            return <Redirect to={RootUrls.dashboard()} />;
                        }
                        else {
                            return componentOrRender(props);
                        }
                    }
                    else {
                        if (loggedInUserId !== undefined && window.location.pathname !== RootUrls.attendeeCollisions(loggedInUserId, true)) {
                            return <Redirect to={RootUrls.attendeeCollisions(loggedInUserId, true)} />;
                        }
                        else {
                            return componentOrRender(props);
                        }
                    }
                }
                else {
                    if (window.location.pathname !== RootUrls.firstDataSync()) {
                        return <Redirect to={RootUrls.firstDataSync()} />;
                    }
                    else {
                        return componentOrRender(props);
                    }
                }
            }
            else {
                return <Redirect to={RootUrls.login()} />;
            }
        }} />);
};

const mapStateToProps = (store: IAppState) => {
    return {
        isAuthenticated: store.authState.authToken !== undefined,
        firstSyncRequired: store.sync.lastSyncEpochMilliseconds === 0,
        profileDataValid: profileIsValid(store.profile.userProfile),
        loggedInUserId: store.profile.userProfile !== null ? store.profile.userProfile.id : undefined,
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AuthenticatedRoute);