import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Paper, Button, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { IOfflineAppState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import TypographyWithHidden from '../UserInterface/TypographyWithHidden';

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
    online: boolean;
    cancelCallback: () => void;
}

const RevokePermissionsConfirmModal: React.FC<IProps> = ({
    show,
    online,
    cancelCallback,
    classes,
}) => {
    const cancelClick = React.useCallback(() => {
        cancelCallback();
    }, [cancelCallback]);

    return (
        <Modal
            className={classes.root}
            aria-labelledby="confirm-revoke-permissions"
            open={show}
            onClose={() => cancelClick()}
        >
            <Paper className={classes.container}>
                <Typography>
                    By revoking permissions, your are permanently removing your information from our database. This means all existing connections will
                    lose your contact information, all your attendee notes will be removed from our database, and we will not longer be able to access
                    your profile information.
                    {show ? 'Show' : 'Hide'}
                </Typography>
                <Typography>
                    This action is irreversible. Are you sure you want to continue?
                </Typography>
                <Button disabled={!online}>Confirm</Button>
                <Button onClick={() => cancelClick()}>Cancel</Button>
                <TypographyWithHidden color="error" hidden={online}>
                    You must be online to perform this action!
                </TypographyWithHidden>
            </Paper>
        </Modal>
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        online: store.offline.online,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(RevokePermissionsConfirmModal));