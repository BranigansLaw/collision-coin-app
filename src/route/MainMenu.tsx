import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Toolbar, Typography, Menu, MenuItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { RootUrls, headerHeight } from '.';
import CreateIcon from '@material-ui/icons/Create';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { IProfile } from '../store/profile';
import { push } from 'connected-react-router';
import AttendeeAvatar from '../components/AttendeeAvatar';
import Logout from '../components/Logout';
import QrCodeIcon from '../assets/svg/QrCodeIcon';
import FlexGrow from '../components/UserInterface/FlewGrow';

const styles = (theme: Theme) => createStyles({
    root: {
        height: headerHeight,
    },
});

interface IProps extends WithStyles<typeof styles> {
    profile: IProfile;
    push: (url: string) => void;
}

const Navbar: React.FC<IProps> = ({
    profile,
    push,
    classes,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLLIElement | null>(null);

    const editProfileClick = () => {
        setAnchorEl(null);
        push(RootUrls.attendeeCollisions(profile.id, true));
    }

    const qrCodeIconClick = () => {
        push(RootUrls.qrCodeScan())
    }

    return (
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
                <MenuItem onClick={() => editProfileClick()}>
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
                <Logout />
                <MenuItem>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Revoke Permissions" />
                </MenuItem>
            </Menu>
        </Toolbar>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (url: string) => dispatch(push(url)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Navbar));