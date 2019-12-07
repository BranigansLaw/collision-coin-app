import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { ThirdParty, thirdPartyLoginActionCreator } from '../store/auth';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Button } from '@material-ui/core';
import { push } from 'connected-react-router';

interface IProps {
    authType: ThirdParty;
    registrationEmail?: string;
    loading: boolean;
    redirectUrl: string | undefined;
    thirdPartyLogin: (loginType: ThirdParty, email?: string) => Promise<void>;
    push: (url: string) => void;
}

const ThirdPartyAuthButton: React.FC<IProps> = ({
    authType,
    registrationEmail,
    loading,
    redirectUrl,
    thirdPartyLogin,
    push,
}) => {
    const login = () => {
        thirdPartyLogin(authType, registrationEmail);
    }

    if (redirectUrl !== undefined) {
        window.location.assign(redirectUrl);
    }

    return (<Button
        onClick={login}>
        {registrationEmail === undefined ? 'Login' : 'Register'} with {authType} {loading ? 'Loading...' : ''}
    </Button>);
}

const mapStateToProps = (store: IAppState) => {
    return {
        loading: store.authState.loading,
        redirectUrl: store.authState.redirectUrl,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        thirdPartyLogin: (loginType: ThirdParty, email?: string) => dispatch(thirdPartyLoginActionCreator(loginType, email)),
        push: (url: string) => dispatch(push(url)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThirdPartyAuthButton);