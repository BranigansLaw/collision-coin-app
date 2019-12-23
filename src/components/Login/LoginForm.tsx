import * as React from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { Button, CircularProgress, Fade } from '@material-ui/core';
import { renderTextField } from '../muiReduxFormIntegration';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';

interface ILoginForm {
    username: string;
    password: string;
};

interface IFormProps {
    loading: boolean;
}

const FormComponent: React.FC<InjectedFormProps<ILoginForm, IFormProps> & IFormProps> = ({
    handleSubmit,
    pristine,
    submitting,
    loading,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field
                    name="username"
                    component={renderTextField}
                    type="text"
                    label="Username"
                    disabled={submitting || loading}
                    margin="normal"
                    required
                />
            </div>
            <div>
                <Field
                    name="password"
                    component={renderTextField}
                    type="password"
                    label="Password"
                    disabled={submitting || loading}
                    margin="normal"
                    required
                />
            </div>
            <div>
                <Button size="large"
                    variant="contained"
                    color="primary" 
                    aria-label="add" 
                    type="submit"
                    disabled={pristine || submitting || loading}>
                    Login
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
}

const LoginForm: React.FC<IProps> = ({
    loading
}) => {
    const login = (username: string, password: string) => {
    }

    return (
        <ConnectedFormComponent loading={loading} onSubmit={(values: ILoginForm) => { login(values.username, values.password); }} />
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        loading: store.authState.loading.googleAuth || 
            store.authState.loading.linkedinAuth || 
            store.authState.loading.normalAuth,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginForm);