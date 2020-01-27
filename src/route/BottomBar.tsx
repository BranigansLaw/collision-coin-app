import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { Link as RouterLink } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { logoutActionCreator } from '../store/auth';
import { MenuItem, AppBar, Toolbar } from '@material-ui/core';
import { RootUrls, footerPadding, footerHeight } from '.';
import Logout from '../components/Logout';

const styles = (theme: Theme) => createStyles({
    root: {
        top: 'auto',
        bottom: 0,
    },
    navbarOffset: {
        height: 15,
    },
    footer: {
        width: `calc(100% - (2 * ${footerPadding}))`,
        padding: footerPadding,
        height: footerHeight,
        position: 'absolute',
        textAlign: 'center',
        left: 0,
        bottom: 0,
    },
});

interface IProps extends WithStyles<typeof styles> {
    isAuthenticated: boolean;
    logout: () => void;
}

const BottomBar: React.FC<IProps> = ({
    classes,
    isAuthenticated,
    logout,
}) => {
    if (isAuthenticated) {
    return (
        <>
            <div className={classes.navbarOffset} />
            <AppBar position="fixed" className={classes.root}>
                <Toolbar variant="dense">
                    <MenuItem component={RouterLink} to={RootUrls.qrCodeScan()}>
                        QR Reader
                    </MenuItem>
                    <Logout />
                </Toolbar>
            </AppBar>
        </>
    );
    }
    else {
        return (                
            <footer className={classes.footer}>
                &copy; Collision Coin Inc. {new Date().getFullYear()} - {process.env.NODE_ENV}
            </footer>);
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        isAuthenticated: store.authState.authToken !== undefined,
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
)(BottomBar));