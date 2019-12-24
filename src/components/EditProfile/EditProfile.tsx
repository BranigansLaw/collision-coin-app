import * as React from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { Button, CircularProgress, Fade } from '@material-ui/core';
import { renderTextField } from '../muiReduxFormIntegration';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';
import { updateProfileActionCreator } from '../../store/profile';

interface IEditProfileForm {
    companyName: string;
    position: string;
};

interface IFormProps {
    loading: boolean;
}

const FormComponent: React.FC<InjectedFormProps<IEditProfileForm, IFormProps> & IFormProps> = ({
    handleSubmit,
    pristine,
    submitting,
    loading,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field
                    name="companyName"
                    value="Default Value 1"
                    component={renderTextField}
                    type="text"
                    label="Company Name"
                    disabled={submitting || loading}
                    margin="normal"
                    required
                />
            </div>
            <div>
                <Field
                    name="position"
                    value="Default Value 2"
                    component={renderTextField}
                    type="text"
                    label="Position"
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
                    Save Changes
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

const ConnectedFormComponent = reduxForm<IEditProfileForm, IFormProps>({
    form: ReduxFormName,
})(FormComponent);

interface IProps {
    currentCompanyName: string;
    currentPosition: string;
    updateProfile: (companyName: string, position: string) => void;
}

const EditProfile: React.FC<IProps> = ({
    currentCompanyName,
    currentPosition,
    updateProfile,
}) => {
    return (
        <ConnectedFormComponent
            loading={false}
            initialValues={{
                companyName: currentCompanyName,
                position: currentPosition,
            }}
            onSubmit={(values: IEditProfileForm) => { updateProfile(values.companyName, values.position); }} />
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        currentCompanyName: store.profile.userProfile !== undefined && store.profile.userProfile.companyName !== undefined ? store.profile.userProfile.companyName : '',
        currentPosition: store.profile.userProfile !== undefined && store.profile.userProfile.position !== undefined ? store.profile.userProfile.position : '',
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        updateProfile: (companyName: string, position: string) => dispatch(updateProfileActionCreator(companyName, position)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditProfile);