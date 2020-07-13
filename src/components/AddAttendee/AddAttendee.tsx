import * as React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../store';
import AddAttendeeForm from './AddAttendeeForm';
import { Typography, Box, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { stringNullEmptyOrUndefined } from '../../util';
import ButtonWithHidden from '../UserInterface/ButtonWithHidden';
import { usePrevious } from '../../usePrevious';

const styles = (theme: Theme) => createStyles({
    root: {
        textAlign: 'center',
    }
});

interface IProps extends WithStyles<typeof styles> {
    title: string;
    newAttendeeQrCodeData: string | undefined;
    showQrCodeButton: boolean;
    conferenceId?: string;
    error: boolean;
}

const AddAttendee: React.FC<IProps> = ({
    title,
    newAttendeeQrCodeData,
    showQrCodeButton,
    conferenceId,
    error,
    classes,
}) => {
    const prevNewAttendeeQrCodeData: string | undefined = usePrevious(newAttendeeQrCodeData);
    const prevError: boolean | undefined = usePrevious(error);

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

    const content = React.useMemo(() => {
        if (prevError !== undefined && prevError !== error && error) {
            return <Typography color="error">Woops! Looks like something happened creating your account! Please reload and try again.</Typography>
        }
        else if (prevNewAttendeeQrCodeData === undefined && prevNewAttendeeQrCodeData !== newAttendeeQrCodeData && !stringNullEmptyOrUndefined(newAttendeeQrCodeData)) {
            return <Typography color="textPrimary">Success! Check your email to finish setting up your account.</Typography>
        }
        else {
            return (
                <>
                    <Typography style={{textAlign: 'center'}}>{title}</Typography>
                    <AddAttendeeForm conferenceId={conferenceId} />
                    <ButtonWithHidden
                        hidden={!showQrCodeButton}
                        variant="contained"
                        onClick={() => click()} disabled={stringNullEmptyOrUndefined(newAttendeeQrCodeData)}
                    >
                        Click to see QR code
                    </ButtonWithHidden>
                </>
            );
        }
    }, [click, conferenceId, error, newAttendeeQrCodeData, prevError, prevNewAttendeeQrCodeData, showQrCodeButton, title]);

    return (
        <Box className={classes.root}>
            {content}
        </Box>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        error: store.admin.errorCreatingAttendee,
        newAttendeeQrCodeData: store.admin.newAttendeeQrCodeData,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddAttendee));