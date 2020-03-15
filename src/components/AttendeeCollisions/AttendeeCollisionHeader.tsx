import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IAttendee } from '../../store/attendee';
import { Typography, Grid } from '@material-ui/core';
import { IProfile } from '../../store/profile';
import AttendeeAvatar from '../AttendeeAvatar';
import { validNonEmptyString } from '../../util';

const avatarWidth = 28;
const avatarRightPadding = 15;
const buttonsWidth = 40;
const headerItemPadding = 8;

const styles = (theme: Theme) => createStyles({
    header: {
        width: 'initial',
        whiteSpace: 'nowrap',
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    avatar: {
        maxWidth: `${avatarWidth}px`,
        marginRight: `${avatarRightPadding}px`,
        padding: `${headerItemPadding}px`,
        paddingRight: 0,
    },
    nameAndTitle: {
        width: `calc(100% - ${avatarWidth}px - ${buttonsWidth}px - ${avatarRightPadding}px - ${headerItemPadding * 2}px)`,
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile | null;
}

const AttendeeCollisionHeader: React.FC<IProps> = ({
    classes,
    toDisplay,
}) => {
    const firstAndLast: string = toDisplay !== null ?
        `${toDisplay.firstName} ${toDisplay.lastName}` :
        `${process.env.REACT_APP_APP_NAME}`;
    const position: string = 
        toDisplay !== null ?
            ((validNonEmptyString(toDisplay.position) && validNonEmptyString(toDisplay.companyName)) ?
                `${toDisplay.position} at ${toDisplay.companyName}` :
                '') :
            `About ${process.env.REACT_APP_APP_NAME}`;

    return (
        <Grid spacing={2} className={classes.header} container direction="row" justify="flex-start" alignItems="center">
            <Grid item className={classes.avatar}>
                <AttendeeAvatar attendee={toDisplay} />
            </Grid>
            <Grid item className={classes.nameAndTitle}>
                <Grid hidden={true} container direction="column" justify="center" alignItems="flex-start">
                    <Grid item>
                        <Typography>{firstAndLast}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography 
                            variant="subtitle2" 
                            className={classes.secondaryHeading}>
                            {position}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(AttendeeCollisionHeader);