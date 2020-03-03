import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { RootUrls } from '.';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface IProps extends RouteProps {
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    render?: (props: RouteComponentProps<any>) => React.ReactNode;
    isAuthenticated: boolean;
}

const UnauthenticatedRoute = ({
    component: Component,
    render,
    isAuthenticated,
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
            if (!isAuthenticated) {
                return componentOrRender(props);
            }
            else {
                return <Redirect to={RootUrls.dashboard()} />;
            }
        }} />);
};

const mapStateToProps = (store: IAppState) => {
    return {
        isAuthenticated: store.authState.authToken !== undefined,
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UnauthenticatedRoute);