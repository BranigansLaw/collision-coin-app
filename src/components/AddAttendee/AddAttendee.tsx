import * as React from 'react';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { Button } from '@material-ui/core';
import { renderTextField, renderSelectField } from '../muiReduxFormIntegration';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';
import { required } from '../Form/formValidators';
import { Guid } from 'guid-typescript';
import { createAttendeeActionCreator, IConference } from '../../store/admin';

interface IFormProps {
    loading: boolean;
    conferences: IConference[];
}

interface ICreateAttendee {
    firstName: string;
    lastName: string;
    email: string;
    conferenceId: string;
}

const FormComponent: React.FC<InjectedFormProps<ICreateAttendee, IFormProps> & IFormProps> = ({
    handleSubmit,
    pristine,
    submitting,
    loading,
    conferences,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <Field
                name="firstName"
                component={renderTextField}
                type="text"
                label="First Name"
                disabled={submitting || loading}
                margin="normal"
                validate={[required]}
            />
            <Field
                name="lastName"
                component={renderTextField}
                type="text"
                label="Last Name"
                disabled={submitting || loading}
                margin="normal"
                validate={[required]}
            />
            <Field
                name="email"
                component={renderTextField}
                type="email"
                label="Email Address"
                disabled={submitting || loading}
                margin="normal"
                validate={[required]}
            />
            <Field
                name="conferenceId"
                component={renderSelectField}
                label="Conference"
                inputProps={{id: 'conference-native-simple', name: 'conference' }}
                validate={[required]}
            >
                <option value="" />
                {conferences.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Field>
            <Button
                size="large"
                variant="contained"
                color="primary" 
                aria-label="add" 
                type="submit"
                disabled={pristine || submitting || loading}>
                Save Changes
            </Button>
        </form>);
};

export const AddAttendeeFormName: string = 'addAttendeeForm';

const ConnectedFormComponent = reduxForm<ICreateAttendee, IFormProps>({
    form: AddAttendeeFormName,
})(FormComponent);

interface IProps {
    conferences: IConference[];
    createAttendee: (firstName: string, lastName: string, email: string, conferenceId: Guid) => void;
}

const AddAttendee: React.FC<IProps> = ({
    conferences,
    createAttendee,
}) => {
    return (
        <>
            <ConnectedFormComponent
                loading={false}
                conferences={conferences}
                enableReinitialize={true}
                onSubmit={(values: ICreateAttendee) => {
                    createAttendee(
                        values.firstName, 
                        values.lastName, 
                        values.email,
                        Guid.parse(values.conferenceId)); 
                }} />
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        conferences: store.admin.conferences,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        createAttendee: (firstName: string, lastName: string, email: string, conferenceId: Guid) =>
            dispatch(createAttendeeActionCreator(firstName, lastName, email, conferenceId)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddAttendee);