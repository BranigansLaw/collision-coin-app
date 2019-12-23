import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { ThirdParty, thirdPartyLoginActionCreator } from '../../store/auth';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Button, Typography, WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    errorMessage: {
        color: theme.palette.error.dark,
    }
});

interface IProps extends WithStyles<typeof styles> {
    authType: ThirdParty;
    userId: string | null;
    registrationCode: string | null;
    googleLoading: boolean;
    linkedInLoading: boolean;
    googleError: boolean;
    linkedInError: boolean;
    thirdPartyLogin: (loginType: ThirdParty, email: string | null, code: string | null) => Promise<string | undefined>;
}

const ThirdPartyAuthButton: React.FC<IProps> = ({
    authType,
    userId,
    registrationCode,
    googleLoading,
    linkedInLoading,
    thirdPartyLogin,
    googleError,
    linkedInError,
    classes,
}) => {
    const login = async () => {
        const redirectTo: string | undefined = await thirdPartyLogin(authType, userId, registrationCode);

        if (redirectTo !== undefined) {
            window.location.assign(redirectTo);
        }
    }

    const isLoading = 
        (authType === ThirdParty.Google && googleLoading) ||
        (authType === ThirdParty.LinkedIn && linkedInLoading);

    const isError = 
        (authType === ThirdParty.Google && googleError) ||
        (authType === ThirdParty.LinkedIn && linkedInError);

    return (
        <>
            <Button
                onClick={login}>
                {userId === undefined ? 'Login' : 'Register'} with {authType} {isLoading ? 'Loading ...' : ''}
            </Button>
            <Typography hidden={!isError} className={classes.errorMessage}>An error occurred. Please try again.</Typography>
        </>);
}

const mapStateToProps = (store: IAppState) => {
    return {
        googleLoading: store.authState.loading.googleAuth,
        linkedInLoading: store.authState.loading.linkedinAuth,
        googleError: store.authState.loginFailed.googleAuth,
        linkedInError: store.authState.loginFailed.linkedinAuth,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        thirdPartyLogin: (loginType: ThirdParty, email: string | null, code: string | null) =>
            dispatch(thirdPartyLoginActionCreator(loginType, email, code)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThirdPartyAuthButton));