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
    userId: string | null
    registrationCode: string | null;
    loading: boolean;
    redirectUrl: string | undefined;
    thirdPartyLogin: (loginType: ThirdParty, email: string | null, code: string | null) => Promise<void>;
    push: (url: string) => void;
}

const ThirdPartyAuthButton: React.FC<IProps> = ({
    authType,
    userId,
    registrationCode,
    loading,
    redirectUrl,
    thirdPartyLogin,
    push,
}) => {
    const login = () => {
        thirdPartyLogin(authType, userId, registrationCode);
    }

    if (redirectUrl !== undefined) {
        window.location.assign(redirectUrl);
    }

    return (<Button
        onClick={login}>
        {userId === undefined ? 'Login' : 'Register'} with {authType} {loading ? 'Loading...' : ''}
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
        thirdPartyLogin: (loginType: ThirdParty, email: string | null, code: string | null) =>
            dispatch(thirdPartyLoginActionCreator(loginType, email, code)),
        push: (url: string) => dispatch(push(url)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThirdPartyAuthButton);