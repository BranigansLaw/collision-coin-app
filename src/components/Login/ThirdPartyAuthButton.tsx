import React from 'react';
import { connect } from 'react-redux';
import { IOfflineAppState } from '../../store';
import { ThirdParty, thirdPartyLoginActionCreator } from '../../store/auth';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Typography, WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import LoadingButton from '../UserInterface/LoadingButton';

const styles = (theme: Theme) => createStyles({
    errorMessage: {
        color: theme.palette.error.dark,
    }
});

interface IProps extends WithStyles<typeof styles> {
    authType: ThirdParty;
    userId: string | undefined;
    registrationCode: string | undefined;
    normalLoading: boolean;
    googleLoading: boolean;
    linkedInLoading: boolean;
    online: boolean;
    googleError?: string;
    linkedInError?: string;
    thirdPartyLogin: (loginType: ThirdParty, email: string | undefined, code: string | undefined) => Promise<string | undefined>;
}

const ThirdPartyAuthButton: React.FC<IProps> = ({
    authType,
    userId,
    registrationCode,
    normalLoading,
    googleLoading,
    linkedInLoading,
    thirdPartyLogin,
    online,
    googleError,
    linkedInError,
    classes,
}) => {
    const login = React.useCallback(async () => {
        const redirectTo: string | undefined = await thirdPartyLogin(authType, userId, registrationCode);

        if (redirectTo !== undefined) {
            window.location.assign(redirectTo);
        }
    }, [authType, userId, registrationCode, thirdPartyLogin]);

    const isLoading = React.useMemo(() => {
        return (authType === ThirdParty.Google && googleLoading) ||
            (authType === ThirdParty.LinkedIn && linkedInLoading);
    }, [authType, googleLoading, linkedInLoading]);

    const otherAuthLoading = React.useMemo(() => {
        return normalLoading || googleLoading || linkedInLoading;
    }, [normalLoading, googleLoading, linkedInLoading])

    const errorMessage: string | undefined = 
        (authType === ThirdParty.Google && googleError !== undefined) ? googleError :
            (authType === ThirdParty.LinkedIn && linkedInError !== undefined) ? linkedInError : undefined;

    return (
        <>
            <LoadingButton
                    size="large"
                    variant="contained"
                    color="primary" 
                    aria-label={userId !== undefined ? 'Register' : 'Login'} 
                    type="submit"
                    disabled={!online || otherAuthLoading}
                    loading={isLoading}
                    onClick={login}
                >
                    {userId !== undefined ? 'Register' : 'Login'} with {authType}
            </LoadingButton>
            <Typography hidden={errorMessage !== undefined} className={classes.errorMessage}>{errorMessage}</Typography>
        </>);
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        normalLoading: store.authState.loading.normalAuth,
        googleLoading: store.authState.loading.googleAuth,
        linkedInLoading: store.authState.loading.linkedinAuth,
        googleError: store.authState.loginFailed.googleAuth,
        linkedInError: store.authState.loginFailed.linkedinAuth,
        online: store.offline.online,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        thirdPartyLogin: (loginType: ThirdParty, email: string | undefined, code: string | undefined) =>
            dispatch(thirdPartyLoginActionCreator(loginType, email, code)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThirdPartyAuthButton));