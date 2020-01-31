import React from 'react';
import { connect } from 'react-redux';
import { IOfflineAppState } from '../../store';
import { Typography, WithStyles, createStyles, withStyles, Theme, Box } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    offlineBanner: {
        padding: theme.spacing(1),
        textAlign: 'center',
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
    },
    navbarOffset: theme.mixins.toolbar,
});

interface IProps extends WithStyles<typeof styles>  {
    online: boolean;
    authenticated: boolean;
    children: React.ReactNode;
}

const OfflineWrapper: React.FC<IProps> = ({
    online,
    authenticated,
    children,
    classes,
}) => {
    return (
        <>
            <div className={classes.navbarOffset} hidden={!authenticated} />
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
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    undefined,
)(OfflineWrapper));