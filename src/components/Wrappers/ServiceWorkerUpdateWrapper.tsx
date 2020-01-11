import React from 'react';
import { connect } from 'react-redux';
import { IOfflineAppState } from '../../store';
import { WithStyles, createStyles, withStyles, Theme, Snackbar, Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { updateServiceWorkerSkipWaitingActionCreator } from '../../store/serviceWorker';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles>  {
    children: React.ReactNode;
    updateAvailable: boolean;
    updateServiceWorker: () => void;
}

const ServiceWorkerUpdateWrapper: React.FC<IProps> = ({
    children,
    updateAvailable,
    updateServiceWorker,
    classes,
}) => {
    const [open, setOpen] = React.useState(true);

    const clickUpdate = () => {
        updateServiceWorker();

        setOpen(false);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setOpen(false);
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={updateAvailable && open}
                  onClose={handleClose}
                  message="A new version of the app is available"
                  action={
                    <React.Fragment>
                        <Button color="secondary" size="small" onClick={clickUpdate}>
                            Update
                        </Button>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                  }/>
            {children}
        </>
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        updateAvailable: store.serviceWorker.updateAvailable,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        updateServiceWorker: () => dispatch(updateServiceWorkerSkipWaitingActionCreator()),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ServiceWorkerUpdateWrapper));