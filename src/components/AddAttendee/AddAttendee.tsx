import * as React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';
import AddAttendeeForm from './AddAttendeeForm';
import { Typography, Box, Button } from '@material-ui/core';
import { stringNullEmptyOrUndefined } from '../../util';

interface IProps {
    newAttendeeQrCodeData: string | undefined;
}

const AddAttendee: React.FC<IProps> = ({
    newAttendeeQrCodeData
}) => {
    const click = React.useCallback(() => {
        if (newAttendeeQrCodeData !== undefined) {
            var image: HTMLImageElement = new Image();
            image.src = newAttendeeQrCodeData;

            var w: Window | null = window.open("");

            if (w != null) {
                w.document.write(image.outerHTML);
            }
        }
    }, [newAttendeeQrCodeData]);

    return (
        <Box>
            <Typography>Create Attendee</Typography>
            <AddAttendeeForm />
            <Button variant="contained" onClick={() => click()} disabled={stringNullEmptyOrUndefined(newAttendeeQrCodeData)}>Click to see QR code</Button>
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