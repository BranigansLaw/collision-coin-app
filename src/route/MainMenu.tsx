import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Toolbar, Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { RootUrls, headerHeight } from '.';
import CreateIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { IProfile, updateUiPreferenceActionCreator } from '../store/profile';
import { push } from 'connected-react-router';
import AttendeeAvatar from '../components/AttendeeAvatar';
import Logout from '../components/Logout';
import QrCodeIcon from '../assets/svg/QrCodeIcon';
import FlexGrow from '../components/UserInterface/FlewGrow';
import RevokePermissionsConfirmModal from '../components/RevokePermissions/RevokePermissionsConfirmModal';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { isAdmin } from '../store/auth';

const styles = (theme: Theme) => createStyles({
    root: {
        height: headerHeight,
    },
});

interface IProps extends WithStyles<typeof styles> {
    profile: IProfile;
    userRoles: string[];
    push: (url: string) => void;
    updateUiPreference: (isLightMode: boolean) => void;
}

const Navbar: React.FC<IProps> = ({
    profile,
    userRoles,
    push,
    updateUiPreference,
    classes,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLLIElement | null>(null);
    const [revokePermissionsModalOpen, setRevokePermissionsModalOpen] = React.useState<boolean>(false);

    const adminDashboardClick = React.useCallback(() => {
        setAnchorEl(null);
        push(RootUrls.adminDashboard());
    }, [setAnchorEl, push]);

    const editProfileClick = React.useCallback(() => {
        setAnchorEl(null);
        push(RootUrls.attendeeCollisions(profile.id, true));
    }, [setAnchorEl, profile.id, push]);

    const aboutUsClick = React.useCallback(() => {
        setAnchorEl(null);
        push(RootUrls.about());
    }, [setAnchorEl, push]);

    const helpClick = React.useCallback(() => {
        setAnchorEl(null);
        push(RootUrls.help());
    }, [setAnchorEl, push]);

    const toggleUiMode = React.useCallback(() => {
        updateUiPreference(!profile.isLightMode);
    }, [updateUiPreference, profile.isLightMode]);

    const qrCodeIconClick = React.useCallback(() => {
        setAnchorEl(null);
        push(RootUrls.myCode())
    }, [setAnchorEl, push]);

    return (
        <>
            <Toolbar className={classes.root} variant="dense" disableGutters={true} aria-controls="main-user-menu" aria-haspopup="true">
                <MenuItem onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => qrCodeIconClick()}>
                    <QrCodeIcon />
                </MenuItem>
                <FlexGrow />
                <MenuItem onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => setAnchorEl(event.currentTarget)}>
                    <AttendeeAvatar attendee={profile} />
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
                    {isAdmin(userRoles) ? <MenuItem onClick={() => adminDashboardClick()} hidden={true}>
                        <ListItemIcon>
                            <SupervisorAccountIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Admin Dashboard" />
                    </MenuItem> : ""}
                    <MenuItem onClick={() => editProfileClick()}>
                        <ListItemIcon>
                            <CreateIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Edit Profile" />
                    </MenuItem>
                    <MenuItem onClick={() => toggleUiMode()}>
                        <ListItemIcon>
                            {profile.isLightMode ? <Brightness3Icon fontSize="small" /> : <WbSunnyIcon fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText primary={`Toggle ${profile.isLightMode ? 'Dark' : 'Light'} Mode`} />
                    </MenuItem>
                    <MenuItem onClick={() => helpClick()}>
                        <ListItemIcon>
                            <HelpIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Help" />
                    </MenuItem>
                    <MenuItem onClick={() => aboutUsClick()}>
                        <ListItemIcon>
                            <InfoIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </MenuItem>
                    <Logout />
                    <MenuItem onClick={() => setRevokePermissionsModalOpen(true)}>
                        <ListItemIcon>
                            <DeleteForeverIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Revoke Permissions" />
                    </MenuItem>
                </Menu>
            </Toolbar>
            <RevokePermissionsConfirmModal
                show={revokePermissionsModalOpen}
                cancelCallback={() => setRevokePermissionsModalOpen(false)} />
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        userRoles: store.authState.roles,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (url: string) => dispatch(push(url)),
        updateUiPreference: (isLightMode: boolean) => dispatch(updateUiPreferenceActionCreator(isLightMode)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Navbar));