import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { logoutActionCreator } from '../store/auth';
import { WithStyles, createStyles, withStyles, Theme, Box, Modal, MenuItem, Button, Typography, ListItemIcon, ListItemText } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const styles = (theme: Theme) => createStyles({
    modalStyle: {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
});

interface IProps extends WithStyles<typeof styles> {
    isAuthenticated: boolean;
    unsavedQueueItems: boolean;
    logout: () => void;
}

const Logout: React.FC<IProps> = ({
    classes,
    isAuthenticated,
    unsavedQueueItems,
    logout,
}) => {
    const [open, setOpen] = React.useState(false);

    const tryLogout = () => {
        if (unsavedQueueItems) {
            setOpen(true);
        }
        else {
            logout();
        }
    }

    const hardLogout = () => {
        setOpen(false);
        logout();
    }

    const cancel = () => {
        setOpen(false);
    }

    return (
        <>
            <MenuItem hidden={isAuthenticated} onClick={() => tryLogout()}>
                <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
            </MenuItem>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={() => hardLogout()}
            >
                <Box className={classes.modalStyle}>
                    <Typography>Warning! There is some unsaved information that has not been sent! If you logout now, you may lose these changes.</Typography>
                    <Button color="primary" variant="contained" onClick={() => hardLogout()}>Logout Anyways</Button>
                    <Button variant="contained" onClick={() => cancel()}>Cancel</Button>
                </Box>
            </Modal>
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        isAuthenticated: store.authState.authToken !== undefined,
        unsavedQueueItems: store.sync.actionQueue.filter(a => a.meta.type !== 'DataSync').length > 0,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        logout: () => dispatch(logoutActionCreator()),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Logout));