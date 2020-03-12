import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IAttendee } from '../../store/attendee';
import { IProfile, isProfile } from '../../store/profile';
import AttendeeAvatar from '../AttendeeAvatar';
import { Box, Badge } from '@material-ui/core';
import FlexGrow from '../UserInterface/FlewGrow';
import CreateIcon from '@material-ui/icons/Create';

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        marginTop: theme.spacing(1.5),
    },
    editIcon: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        borderRadius: '50px',
        padding: theme.spacing(1),
        height: theme.spacing(4),
        width: theme.spacing(4),
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
}

const LargeCenteredAvatar: React.FC<IProps> = ({
    classes,
    toDisplay,
}) => {
    return (
        <Box className={classes.root}>
            <FlexGrow />
            <Badge
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={isProfile(toDisplay) ? (<CreateIcon className={classes.editIcon} />) : 0}
            >
                <AttendeeAvatar
                    size="large"
                    attendee={toDisplay}
                />
            </Badge>
            <FlexGrow />
        </Box>);
}

export default withStyles(styles)(LargeCenteredAvatar);