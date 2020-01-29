import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { AppBar, Toolbar, Typography, Menu, MenuItem, ListItemText, ListItemIcon, Avatar } from '@material-ui/core';
import { headerHeight } from '.';
import CreateIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { IProfile } from '../store/profile';
import { logoutActionCreator } from '../store/auth';

const styles = (theme: Theme) => createStyles({
    header: {
        height: headerHeight,
    },
    avatar: {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        fontSize: theme.spacing(2),
        fontWeight: 600,
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    navbarOffset: theme.mixins.toolbar,
});

interface IProps extends WithStyles<typeof styles> {
    profile: IProfile | null;
    logout: () => void;
}

const Navbar: React.FC<IProps> = ({
    profile,
    logout,
    classes,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLLIElement | null>(null);

    if (profile !== null) {
        const getAvatar = () => {
            if (profile.profilePictureBase64Data) {
                return <Avatar className={classes.avatar} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />;
            }
            else {
                return <Avatar className={classes.avatar}>{profile.firstName[0]}{profile.lastName[0]}</Avatar>;
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
                            <MenuItem onClick={() => logout()}>
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
    else {
        return <></>;
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        profile: store.profile.userProfile,
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