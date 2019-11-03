import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import QrReader from 'react-qr-reader';
import { Guid } from 'guid-typescript';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { push } from 'connected-react-router';
import { scanAttendeeActionCreator } from '../store/attendee';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    scanAttendee: (id: Guid, name: string) => Promise<void>;
    push: (url: string) => void;
}

const QrCodeReaderPage: React.FC<IProps> = ({
    scanAttendee,
    push,
    classes,
}) => {
    const [data, setData] = React.useState("");

    const handleScan = (scannedData: string | null) => {
        if (scannedData !== null && scannedData.length > 36) {
            const idString: string = scannedData.substring(0, 36);
            const name: string = scannedData.substring(36);

            if (Guid.isGuid(idString)) {
                debugger;
                const id: Guid = Guid.parse(idString);

                scanAttendee(id, name);
                push(`/attendee/${id.toString()}`);
            }
            else {
                handleError("The QR Code Scanner was invalid.");
            }
        }
      }

    const handleError = (err: string) => {
        setData(err);
    }

    return (
        <div className={classes.root}>
            <div>
                {data}
            </div>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan} />
        </div>
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        scanAttendee: (id: Guid, name: string) => dispatch(scanAttendeeActionCreator(id, name)),
        push: (url: string) => dispatch(push(url))
    };
};

export default withStyles(styles)(connect(
    null,
    mapDispatchToProps,
)(QrCodeReaderPage));