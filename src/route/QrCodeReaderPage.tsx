import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import QrReader from 'react-qr-reader';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { push } from 'connected-react-router';
import { createAttendeeCollisionActionCreator } from '../store/attendee';
import { RootUrls } from '.';
import { IRedeemable, setCurrentRedeemableActionCreator } from '../store/redemption';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    push: (url: string) => void;
    createAttendeeCollision: (id: string, firstName: string, lastName: string) => void;
    setCurrentRedeemable: (newCurrent: IRedeemable) => void;
}

const QrCodeReaderPage: React.FC<IProps> = ({
    push,
    createAttendeeCollision,
    setCurrentRedeemable,
    classes,
}) => {
    const [data, setData] = React.useState("");
    const qrScanUrlFromEnv: string = `${process.env.REACT_APP_QR_SCAN_URL}`;

    const handleScan = (scannedData: string | null) => {
        if (scannedData !== null && scannedData.length > 0 && scannedData.indexOf(qrScanUrlFromEnv) >= 0) {
            const data: string = scannedData.substring(qrScanUrlFromEnv.length);
            const dataSplit: string[] = data.split('#');
            const type: number = +dataSplit[0];
            const id: string = dataSplit[1];
            const meta: string[] = dataSplit.splice(2);

            switch (type) {
                case 1:
                    createAttendeeCollision(id, meta[0], meta[1]);
                    push(RootUrls.attendeeCollisions(id));
                    break;
                case 2:
                    setCurrentRedeemable({
                        id: id,
                        name: meta[0],
                        cost: +meta[1],
                    } as IRedeemable);
                    push(RootUrls.currentRedemption());
                    break;
            }
        }
    }

    const handleError = (err: any) => {
        setData(err.toString());
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
        push: (url: string) => dispatch(push(url)),
        createAttendeeCollision: (id: string, firstName: string, lastName: string) => dispatch(createAttendeeCollisionActionCreator(id, firstName, lastName)),
        setCurrentRedeemable: (newCurrent: IRedeemable) => dispatch(setCurrentRedeemableActionCreator(newCurrent)),
    };
};

export default withStyles(styles)(connect(
    null,
    mapDispatchToProps,
)(QrCodeReaderPage));