import React from 'react';
import { connect } from 'react-redux';
import { IOfflineAppState } from '../../store';
import { Typography, WithStyles, createStyles, withStyles, Theme, Box } from '@material-ui/core';
import { headerHeight, walletBarHeight, RootUrls } from '../../route';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const styles = (theme: Theme) => createStyles({
    offlineBanner: {
        padding: theme.spacing(1),
        textAlign: 'center',
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
    },
    navbarOffset: {
        height: `calc(${headerHeight} + ${walletBarHeight})`,
    },
});

interface IProps extends WithStyles<typeof styles>  {
    online: boolean;
    authenticated: boolean;
    location: string;
    children: React.ReactNode;
}

const OfflineWrapper: React.FC<IProps> = ({
    online,
    authenticated,
    location,
    children,
    classes,
}) => {
    return (
        <>
            <div className={classes.navbarOffset} hidden={!authenticated || location === RootUrls.firstDataSync()} />
            <Box className={classes.offlineBanner} hidden={online}>
                <Typography>The app is currently offline. Some functionality may not be available.</Typography>
            </Box>
            {children}
        </>
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        online: store.offline.online,
        authenticated: store.authState.authToken !== undefined,
        location: store.router.location.pathname,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(OfflineWrapper));