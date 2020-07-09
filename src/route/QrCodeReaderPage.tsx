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
import { IOfflineAppState } from '../store';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    searchData: string;
    push: (url: string) => void;
    createAttendeeCollision: (id: string, firstName: string, lastName: string) => void;
    setCurrentRedeemable: (newCurrent: IRedeemable) => void;
}

const QrCodeReaderPage: React.FC<IProps> = ({
    searchData,
    push,
    createAttendeeCollision,
    setCurrentRedeemable,
    classes,
}) => {
    const [data, setData] = React.useState("");
    const qrScanUrlFromEnv: string = `${process.env.REACT_APP_QR_SCAN_URL}`;

    const handleScan = React.useCallback(async (scannedData: string | null) => {
        if (scannedData !== null && scannedData.length > 0 && scannedData.indexOf(qrScanUrlFromEnv) >= 0) {
            if (process.env.REACT_APP_RESERVED_QR_SPLITTER === undefined) {
                throw Error("process.env.REACT_APP_RESERVED_QR_SPLITTER not defined");
            }

            const data: string = scannedData.substring(qrScanUrlFromEnv.length);
            const dataSplit: string[] = data.split(process.env.REACT_APP_RESERVED_QR_SPLITTER);
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
    }, [createAttendeeCollision, push, qrScanUrlFromEnv, setCurrentRedeemable]);

    const handleError = React.useCallback((err: any) => {
        setData(err.toString());
    }, [setData]);

    React.useEffect(() => {
        const params: URLSearchParams = new URLSearchParams(searchData);
        if (params.has("d")) {
            const data: string | null = params.get("d");
            if (data !== null) {
                handleScan(window.location.href);
            }
        }
    }, [searchData, handleScan]);

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

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        searchData: store.router.location.search,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (url: string) => dispatch(push(url)),
        createAttendeeCollision: (id: string, firstName: string, lastName: string) => dispatch(createAttendeeCollisionActionCreator(id, firstName, lastName)),
        setCurrentRedeemable: (newCurrent: IRedeemable) => dispatch(setCurrentRedeemableActionCreator(newCurrent)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(QrCodeReaderPage));