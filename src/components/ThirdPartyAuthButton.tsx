import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { ThirdParty, thirdPartyLoginActionCreator } from '../store/auth';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Button } from '@material-ui/core';

interface IProps {
    authType: ThirdParty;
    userId: string | null
    registrationCode: string | null;
    loading: boolean;
    thirdPartyLogin: (loginType: ThirdParty, email: string | null, code: string | null) => Promise<string>;
}

const ThirdPartyAuthButton: React.FC<IProps> = ({
    authType,
    userId,
    registrationCode,
    loading,
    thirdPartyLogin,
}) => {
    const login = async () => {
        const redirectTo: string = await thirdPartyLogin(authType, userId, registrationCode);
        window.location.assign(redirectTo);
    }

    return (<Button
        onClick={login}>
        {userId === undefined ? 'Login' : 'Register'} with {authType} {loading ? 'Loading...' : ''}
    </Button>);
}

const mapStateToProps = (store: IAppState) => {
    return {
        loading: store.authState.loading,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        thirdPartyLogin: (loginType: ThirdParty, email: string | null, code: string | null) =>
            dispatch(thirdPartyLoginActionCreator(loginType, email, code)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThirdPartyAuthButton);