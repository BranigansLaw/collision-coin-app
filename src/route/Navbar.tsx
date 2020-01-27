import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { logoutActionCreator } from '../store/auth';
import { AppBar, Toolbar, Typography, Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { headerHeight } from '.';
import SendIcon from '@material-ui/icons/Send';

const styles = (theme: Theme) => createStyles({
    header: {
        height: headerHeight,
    },
    navbarOffset: theme.mixins.toolbar,
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
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <>
            <AppBar position="fixed" className={classes.header}>
                <Toolbar variant="dense">
                    <MenuItem onClick={() => setMenuOpen(!menuOpen)}>
                        Show Menu
                    </MenuItem>
                    <Typography variant="h5">Collision Coin</Typography>
                    <Menu
                        open={menuOpen}
                        elevation={0}
                        keepMounted
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <MenuItem>
                            <ListItemIcon>
                                <SendIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Sent mail" />
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <div className={classes.navbarOffset} />
        </>
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