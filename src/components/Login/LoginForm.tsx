import * as React from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { Button, CircularProgress, Fade, Typography } from '@material-ui/core';
import { renderTextField } from '../muiReduxFormIntegration';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IOfflineAppState } from '../../store';
import { loginActionCreator, registerActionCreator } from '../../store/auth';
import { push } from 'connected-react-router';
import { RootUrls } from '../../route';

interface ILoginForm {
    username: string;
    password: string;
};

interface IFormProps {
    loading: boolean;
    isRegister: boolean;
    online: boolean;
    errorMessage: string | undefined;
}

const FormComponent: React.FC<InjectedFormProps<ILoginForm, IFormProps> & IFormProps> = ({
    handleSubmit,
    pristine,
    submitting,
    loading,
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
                <Button size="large"
                    variant="contained"
                    color="primary" 
                    aria-label="add" 
                    type="submit"
                    disabled={pristine || submitting || loading || !online}>
                    {isRegister ? 'Register' : 'Login'}
                </Button>
                <Fade
                    in={loading}
                    unmountOnExit>
                    <CircularProgress size={30} />
                </Fade>
            </div>
        </form>);
};

const ReduxFormName: string = 'loginForm';

const ConnectedFormComponent =  reduxForm<ILoginForm, IFormProps>({
    form: ReduxFormName,
})(FormComponent);

interface IProps {
    loading: boolean;
    forcedLogout: boolean;
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
    forcedLogout,
    online,
    errorMessage,
    userId,
    registrationCode,
    login,
    register,
    push,
}) => {
    if (errorMessage === undefined && forcedLogout) {
        errorMessage = "Oh snap! An error occurred. Please login again."
    }

    return (
        <ConnectedFormComponent 
            online={online}
            loading={loading} 
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
        loading: store.authState.loading.googleAuth || 
            store.authState.loading.linkedinAuth || 
            store.authState.loading.normalAuth,
        errorMessage: store.authState.loginFailed.normalAuth,
        forcedLogout: store.authState.wasForcedLogout,
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