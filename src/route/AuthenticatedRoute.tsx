import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { RootUrls } from '.';
import { connect } from 'react-redux';
import { IAppState } from '../store';

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    isAuthenticated: boolean;
}

const AuthenticatedRoute = ({
    component: Component,
    isAuthenticated,
    ...rest 
}: IProps) => (
    <Route {...rest} render={(props) => (
        isAuthenticated
            ? <Component {...props} />
            : <Redirect to={RootUrls.login()} />
    )} />
)

const mapStateToProps = (store: IAppState) => {
    return {
        isAuthenticated: store.authState.authToken !== undefined,
    };
}

export default connect(
    mapStateToProps
)(AuthenticatedRoute);