import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { logoutActionCreator } from '../store/auth';
import { AppBar, Toolbar, Typography, Menu, MenuItem, ListItemText, ListItemIcon, Avatar } from '@material-ui/core';
import { headerHeight } from '.';
import CreateIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const styles = (theme: Theme) => createStyles({
    header: {
        height: headerHeight,
    },
    avatar: {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        fontSize: theme.spacing(2),
        fontWeight: 600,
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
    const [anchorEl, setAnchorEl] = React.useState<HTMLLIElement | null>(null);

    const getAvatar = () => {
        if (false) {
            return <Avatar className={classes.avatar} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />;
        }
        else {
            return <Avatar className={classes.avatar}>TF</Avatar>;
        }
    };

    return (
        <>
            <AppBar position="fixed" className={classes.header}>
                <Toolbar variant="dense" disableGutters={true} aria-controls="main-user-menu" aria-haspopup="true">
                    <MenuItem onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => setAnchorEl(event.currentTarget)}>
                        {getAvatar()}
                    </MenuItem>
                    <Menu
                        id="main-user-menu"
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        anchorEl={anchorEl}
                        elevation={0}
                        keepMounted
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem>
                            <ListItemIcon>
                                <CreateIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Edit Profile" />
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <HelpIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Help" />
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <InfoIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="About" />
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <DeleteForeverIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Revoke Permissions" />
                        </MenuItem>
                    </Menu>
                    <Typography variant="h5">Collision Coin</Typography>
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