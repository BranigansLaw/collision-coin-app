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
    }
});

interface IProps extends WithStyles<typeof styles>  {
    online: boolean;
    children: React.ReactNode;
}

const OfflineWrapper: React.FC<IProps> = ({
    online,
    children,
    classes,
}) => {
    return (
        <>
            <Box className={classes.offlineBanner} hidden={online}>
                <Typography>The app is currently offline. Please reconnect to the internet.</Typography>
            </Box>
            {children}
        </>
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        online: store.offline.online,
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    undefined,
)(OfflineWrapper));