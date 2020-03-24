import * as React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';
import AddAttendeeForm from './AddAttendeeForm';
import CodeDisplay from '../MyQrCode/CodeDisplay';
import { Typography, Box } from '@material-ui/core';

interface IProps {
    newAttendeeQrCodeData: string | undefined;
}

const AddAttendee: React.FC<IProps> = ({
    newAttendeeQrCodeData
}) => {
    return (
        <Box>
            <Typography>Create Attendee</Typography>
            <AddAttendeeForm />
            <CodeDisplay qrCode={newAttendeeQrCodeData} />
        </Box>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        newAttendeeQrCodeData: store.admin.newAttendeeQrCodeData,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddAttendee);