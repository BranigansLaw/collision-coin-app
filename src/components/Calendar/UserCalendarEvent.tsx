import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IEvent } from '../../store/calendar';
import { Typography } from '@material-ui/core';
import NeonPaper, { NeonPaperTypography } from '../UserInterface/NeonPaper';

const styles = (theme: Theme) => createStyles({
    root: {
        height: '100%',
        margin: 0,
    },
    title: {
        fontWeight: 'bold',
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
        <NeonPaper color="green" className={classes.root} density="dense">
            <NeonPaperTypography shade="light" className={classes.title}>{event.name} - {startDate.getHours()}:{startDate.getMinutes()}</NeonPaperTypography>
            <NeonPaperTypography shade="dark">{event.location}</NeonPaperTypography>
            <Typography variant="subtitle2">{event.description}</Typography>
        </NeonPaper>
    );
}

export default withStyles(styles)(UserCalendarEvent);