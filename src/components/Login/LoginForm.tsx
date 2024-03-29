import * as React from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { Typography } from '@material-ui/core';
import { renderTextField } from '../muiReduxFormIntegration';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IOfflineAppState } from '../../store';
import { loginActionCreator, registerActionCreator, LogoutReason } from '../../store/auth';
import { push } from 'connected-react-router';
import { RootUrls } from '../../route';
import LoadingButton from '../UserInterface/LoadingButton';

interface ILoginForm {
    username: string;
    password: string;
};

interface IFormProps {
    loading: boolean;
    preventSubmit: boolean;
    isRegister: boolean;
    online: boolean;
    errorMessage: string | undefined;
}

const FormComponent: React.FC<InjectedFormProps<ILoginForm, IFormProps> & IFormProps> = ({
    handleSubmit,
    pristine,
    submitting,
    loading,
    preventSubmit,
    isRegister,
    online,
    errorMessage,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field
                    name="username"
                    component={renderTextField}
                    type="text"
                    label="Username"
                    disabled={submitting || loading || isRegister}
                    margin="normal"
                    required
                />
            </div>
            <div>
                <Field
                    name="password"
                    component={renderTextField}
                    type="password"
                    label={isRegister ? "Choose your password" : "Password"}
                    disabled={submitting || loading}
                    margin="normal"
                    required
                />
            </div>
            <div>
                <Typography hidden={errorMessage === undefined}>{errorMessage}</Typography>
            </div>
            <div>
                <LoadingButton
                    size="large"
                    variant="contained"
                    color="primary" 
                    aria-label={isRegister ? 'Register' : 'Login'} 
                    type="submit"
                    disabled={pristine || submitting || !online || preventSubmit}
                    loading={loading}
                >
                    {isRegister ? 'Register' : 'Login'}
                </LoadingButton>
            </div>
        </form>);
};

const ReduxFormName: string = 'loginForm';

const ConnectedFormComponent =  reduxForm<ILoginForm, IFormProps>({
    form: ReduxFormName,
})(FormComponent);

interface IProps {
    loading: boolean;
    disabled: boolean;
    logoutReason: LogoutReason | undefined;
    online: boolean;
    errorMessage: string | undefined;
    userId?: string;
    registrationCode?: string;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string, code: string) => Promise<boolean>;
    push: (url: string) => void;
}

const LoginForm: React.FC<IProps> = ({
    loading,
    disabled,
    logoutReason,
    online,
    errorMessage,
    userId,
    registrationCode,
    login,
    register,
    push,
}) => {
    if (errorMessage === undefined && logoutReason !== undefined) {
        errorMessage = logoutReason === 'expiry' ?
            "Oh snap! An error occurred. Please login again." :
            "Your account has been successfully removed.";
    }

    return (
        <ConnectedFormComponent 
            online={online}
            loading={loading} 
            preventSubmit={disabled}
            errorMessage={errorMessage}
            isRegister={registrationCode !== undefined}
            initialValues={{
                username: userId,
            }}
            onSubmit={async (values: ILoginForm) => { 
                let authSuccess: boolean = false;
                if (registrationCode !== undefined) {
                    authSuccess = await register(values.username, values.password, registrationCode);
                }
                else {
                    authSuccess = await login(values.username, values.password);
                }

                if (authSuccess) {
                    push(RootUrls.dashboard());
                }
            }} />
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        disabled: store.authState.loading.googleAuth || 
            store.authState.loading.linkedinAuth || 
            store.authState.loading.normalAuth,
        loading: store.authState.loading.normalAuth,
        errorMessage: store.authState.loginFailed.normalAuth,
        logoutReason: store.authState.logoutReason,
        online: store.offline.online,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        login: (username: string, password: string) => dispatch(loginActionCreator(username, password)),
        register: (username: string, password: string, code: string) => dispatch(registerActionCreator(username, password, code)),
        push: (url: string) => dispatch(push(url)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginForm);