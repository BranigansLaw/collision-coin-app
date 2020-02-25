import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IEvent } from '../../store/calendar';
import { Typography, Paper } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    root: {
        height: '100%',
        width: '100%',
    },
});

interface IProps extends WithStyles<typeof styles> {
    event: IEvent;
}

const UserCalendarEvent: React.FC<IProps> = ({
    event,
    classes,
}) => {
    const startDate: Date = new Date(event.startTimeEpochMilliseconds);
    return (
        <Paper className={classes.root} variant="outlined">
            <Typography>{event.name} - {startDate.getHours()}:{startDate.getMinutes()}</Typography>
            <Typography>{event.description}</Typography>
            <Typography>{event.location}</Typography>
        </Paper>
    );
}

export default withStyles(styles)(UserCalendarEvent);