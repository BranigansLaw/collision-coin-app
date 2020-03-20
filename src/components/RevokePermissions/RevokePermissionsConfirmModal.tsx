import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Paper, Button, Typography, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { IOfflineAppState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import TypographyWithHidden from '../UserInterface/TypographyWithHidden';
import { revokeLoggedInUserPermissionsActionCreator } from '../../store/profile';

const styles = (theme: Theme) => createStyles({
    root: {
    },
    container: {
        padding: theme.spacing(2),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: `calc(100% - (${theme.spacing(2)}px * 2))`,
    },
});

interface IProps extends WithStyles<typeof styles> {
    show: boolean;
    revokeStatus: 'loading' | 'complete' | undefined,
    online: boolean;
    revokeUserPermissions: () => void,
    cancelCallback: () => void;
}

const RevokePermissionsConfirmModal: React.FC<IProps> = ({
    show,
    revokeStatus,
    online,
    revokeUserPermissions,
    cancelCallback,
    classes,
}) => {
    const cancelClick = React.useCallback(() => {
        cancelCallback();
    }, [cancelCallback]);

    const revokeClick = React.useCallback(() => {
        revokeUserPermissions();
    }, [revokeUserPermissions]);

    return (
        <Modal
            className={classes.root}
            aria-labelledby="confirm-revoke-permissions"
            open={show}
        >
            {revokeStatus === undefined ? <Paper className={classes.container}>
                <Typography component="p">
                    By revoking permissions, your are permanently removing your information from our database. This means all existing connections will
                    lose your contact information, all your attendee notes will be removed from our database, and we will not longer be able to access
                    your profile information.
                </Typography>
                <Typography component="p">
                    This action is irreversible. Are you sure you want to continue?
                </Typography>
                <Button onClick={() => revokeClick()} disabled={!online}>Confirm</Button>
                <Button onClick={() => cancelClick()}>Cancel</Button>
                <TypographyWithHidden color="error" hidden={online}>
                    You must be online to perform this action!
                </TypographyWithHidden>
            </Paper> : 
            <Paper className={classes.container}>
                <Typography component="p">Please wait while we remove all records of your from our database. This should only take a moment.</Typography>
                <CircularProgress />
            </Paper>}
        </Modal>
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        revokeStatus: store.profile.revokingPermissions,
        online: store.offline.online,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        revokeUserPermissions: () => dispatch(revokeLoggedInUserPermissionsActionCreator()),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(RevokePermissionsConfirmModal));