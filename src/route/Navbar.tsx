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
import { headerHeight } from '.';

const styles = (theme: Theme) => createStyles({
    header: {
        height: headerHeight,
    },   
    logo: {
        height: 'calc(100% - 1em)',
        margin: '0.5em',
        marginRight: '2em',
    }, 
});

interface IProps extends WithStyles<typeof styles> {
    isAuthenticated: boolean;
    logout: () => void;
}

const Navbar: React.FC<IProps> = ({
    classes,
    isAuthenticated,
    logout,
}) => {
    return (
        <AppBar position="static" className={classes.header}>
            <Toolbar variant="dense">
                <MenuItem component={RouterLink} to="/qrcode">
                    QR Reader
                </MenuItem>
                <MenuItem hidden={isAuthenticated} onClick={() => logout()}>
                    Logout
                </MenuItem>
            </Toolbar>
        </AppBar>
    );
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
)(Navbar));