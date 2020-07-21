import * as React from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { Button, TextField } from '@material-ui/core';
import { renderTextField, renderHideableMultilineTextField } from '../muiReduxFormIntegration';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';
import { updateProfileActionCreator, IProfile, IUpdateProfileFields } from '../../store/profile';
import { nullStringToEmpty } from '../../util';

interface IFormProps {
    loading: boolean;
    hideSubmit: boolean;
}

const FormComponent: React.FC<InjectedFormProps<IUpdateProfileFields, IFormProps> & IFormProps> = ({
    handleSubmit,
    pristine,
    submitting,
    loading,
    hideSubmit,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <Field
                name="companyName"
                component={renderTextField}
                type="text"
                label="Company Name"
                disabled={submitting || loading}
                margin="normal"
            />
            <Field
                name="position"
                component={renderTextField}
                type="text"
                label="Position"
                disabled={submitting || loading}
                margin="normal"
            />
            <Field
                name="description"
                component={renderHideableMultilineTextField}
                type="text"
                label="Tell us about yourself"
                disabled={submitting || loading}
                margin="normal"
                multiline
            />
            <Field
                name="companyDivision"
                component={renderTextField}
                type="text"
                label="Company Division"
                disabled={submitting || loading}
                margin="normal"
            />
            <Field
                name="phoneNumber"
                component={renderTextField}
                type="tel"
                label="Phone Number"
                disabled={submitting || loading}
                margin="normal"
            />
            <Field
                name="skype"
                component={renderTextField}
                type="text"
                label="Skype"
                disabled={submitting || loading}
            />
            <Field
                name="website"
                component={renderTextField}
                type="url"
                label="Website"
                disabled={submitting || loading}
                margin="normal"
            />
            <Field
                name="linkedIn"
                component={renderTextField}
                type="text"
                label="LinkedIn Username"
                disabled={submitting || loading}
                margin="normal"
            />
            <Field
                name="address"
                component={renderHideableMultilineTextField}
                type="text"
                label="Work Address"
                disabled={submitting || loading}
                margin="normal"
                multiline
            />
            {hideSubmit ? '' : (
                <Button
                    size="large"
                    variant="contained"
                    color="primary" 
                    aria-label="add" 
                    type="submit"
                    disabled={pristine || submitting || loading}>
                    Save Changes
                </Button>)}
        </form>);
};

export const EditProfileFormName: string = 'editProfileForm';

const ConnectedFormComponent = reduxForm<IUpdateProfileFields, IFormProps>({
    form: EditProfileFormName,
})(FormComponent);

interface IProps {
    profileFields: IProfile | null;
    hideSubmit?: boolean;
    updateProfile: (updateProfileFields: IUpdateProfileFields) => void;
}

const readonlyFields: {name: string; label: string; value: (v: IProfile) => string}[] = [
    { name: 'firstName', label: 'First Name', value: v => v.firstName },
    { name: 'lastName', label: 'Last Name', value: v => v.lastName },
    { name: 'email', label: 'Email', value: v => v.email !== null ? v.email : '' },
];

const EditProfile: React.FC<IProps> = ({
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
            {profileFields === null ? "" : (
                <ConnectedFormComponent
                    hideSubmit={hideSubmit !== undefined ? hideSubmit : false}
                    loading={false}
                    initialValues={{
                        companyName: nullStringToEmpty(profileFields.companyName),
                        position: nullStringToEmpty(profileFields.position),
                        description: nullStringToEmpty(profileFields.description),
                        companyDivision: nullStringToEmpty(profileFields.companyDivision),
                        linkedIn: nullStringToEmpty(profileFields.linkedInUsername),
                        phoneNumber: nullStringToEmpty(profileFields.phoneNumber),
                        skype: nullStringToEmpty(profileFields.skype),
                        website: nullStringToEmpty(profileFields.website),
                        address: nullStringToEmpty(profileFields.address),
                    }}
                    enableReinitialize={true}
                    onSubmit={(values: IUpdateProfileFields) => { updateProfile(values); }} />)}
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        profileFields: store.profile.userProfile,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        updateProfile: (updateProfileFields: IUpdateProfileFields) => dispatch(updateProfileActionCreator(updateProfileFields)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditProfile);