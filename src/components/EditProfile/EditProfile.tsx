import * as React from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { Button, TextField } from '@material-ui/core';
import { renderTextField } from '../muiReduxFormIntegration';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';
import { updateProfileActionCreator, IProfile } from '../../store/profile';

interface IEditProfileForm {
    companyName: string;
    position: string;
};

interface IFormProps {
    loading: boolean;
    hideSubmit: boolean;
}

const required = (value: any) => (value || typeof value === 'number' ? undefined : 'Required');

const FormComponent: React.FC<InjectedFormProps<IEditProfileForm, IFormProps> & IFormProps> = ({
    handleSubmit,
    pristine,
    submitting,
    loading,
    hideSubmit,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field
                    name="companyName"
                    component={renderTextField}
                    type="text"
                    label="Company Name"
                    disabled={submitting || loading}
                    margin="normal"
                    validate={[required]}
                />
            </div>
            <div>
                <Field
                    name="position"
                    component={renderTextField}
                    type="text"
                    label="Position"
                    disabled={submitting || loading}
                    margin="normal"
                    validate={[required]}
                />
            </div>
            <div hidden={hideSubmit}>
                <Button size="large"
                    variant="contained"
                    color="primary" 
                    aria-label="add" 
                    type="submit"
                    disabled={pristine || submitting || loading}>
                    Save Changes
                </Button>
            </div>
        </form>);
};

export const EditProfileFormName: string = 'editProfileForm';

const ConnectedFormComponent = reduxForm<IEditProfileForm, IFormProps>({
    form: EditProfileFormName,
})(FormComponent);

interface IProps {
    currentCompanyName: string;
    currentPosition: string;
    profileFields: IProfile | null;
    hideSubmit?: boolean;
    updateProfile: (companyName: string, position: string) => void;
}

const readonlyFields: {name: string; label: string; value: (v: IProfile) => string}[] = [
    { name: 'firstName', label: 'First Name', value: v => v.firstName },
    { name: 'lastName', label: 'Last Name', value: v => v.lastName },
    { name: 'email', label: 'Email', value: v => v.email !== null ? v.email : '' },
];

const EditProfile: React.FC<IProps> = ({
    currentCompanyName,
    currentPosition,
    profileFields,
    hideSubmit,
    updateProfile,
}) => {
    return (
        <>
            {profileFields === null ? "" : readonlyFields.map(field => (
                <div key={field.name}>
                    <TextField 
                        name={field.name}
                        value={field.value(profileFields)}
                        type="text"
                        label={field.label}
                        disabled={true}
                        margin="normal"
                    />
                </div>
            ))}
            <ConnectedFormComponent
                loading={false}
                hideSubmit={hideSubmit !== undefined ? hideSubmit : false}
                initialValues={{
                    companyName: currentCompanyName,
                    position: currentPosition,
                }}
                enableReinitialize={true}
                onSubmit={(values: IEditProfileForm) => { updateProfile(values.companyName, values.position); }} />
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        currentCompanyName: store.profile.userProfile !== null && store.profile.userProfile.companyName !== null ? store.profile.userProfile.companyName : '',
        currentPosition: store.profile.userProfile !== null && store.profile.userProfile.position !== null ? store.profile.userProfile.position : '',
        profileFields: store.profile.userProfile,
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