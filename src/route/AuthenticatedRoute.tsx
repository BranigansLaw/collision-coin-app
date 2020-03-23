import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { RootUrls } from '.';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { profileIsValid } from '../store/profile';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { isAdmin } from '../store/auth';

interface IProps extends RouteProps {
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    render?: (props: RouteComponentProps<any>) => React.ReactNode;
    isAuthenticated: boolean;
    userRules: string[];
    firstSyncRequired: boolean;
    profileDataValid: boolean;
    loggedInUserId: string | undefined;
    requiredRoles?: string[] | undefined
}

const AuthenticatedRoute = ({
    component: Component,
    render,
    isAuthenticated,
    userRules,
    firstSyncRequired,
    profileDataValid,
    loggedInUserId,
    requiredRoles,
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

    const [hasCorrectRoles, setHasCorrectRoles] = React.useState<boolean>(true);
    React.useEffect(() => {
        if (requiredRoles !== undefined) {
            setHasCorrectRoles(isAdmin(userRules));
        }
        else {
            setHasCorrectRoles(true);
        }
    }, [setHasCorrectRoles, requiredRoles, userRules]);

    return (
        <Route {...rest} render={(props) => {
            if (isAuthenticated && hasCorrectRoles) {
                if (!firstSyncRequired) {
                    if (profileDataValid) {
                        return componentOrRender(props);
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
        userRules: store.authState.roles,
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