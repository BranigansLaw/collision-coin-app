import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IEvent } from '../../store/event';
import { Box, Typography, Grid } from '@material-ui/core';
import UserCalendarEvent from './UserCalendarEvent';

const hourEntryHeight: number = 84;
const styles = (theme: Theme) => createStyles({
    root: {
        height: hourEntryHeight,
    },
    hourTitle: {
        width: theme.spacing(3),
    },
    eventsContainer: {
        position: 'relative',
        boxSizing: 'border-box',
        width: `calc(100% - ${theme.spacing(3)}px)`,
    },
    calendarContainer: {
        position: 'absolute',
    },
});

interface IProps extends WithStyles<typeof styles> {
    hoursEpochHours: number;
    events: IEvent[];
}

const UserCalendarHourEntry: React.FC<IProps> = ({
    hoursEpochHours,
    events,
    classes,
}) => {
    const date: Date = new Date(hoursEpochHours * 3600000);
    const sortedEvents: IEvent[] = events.sort((a, b) => a.startEpochMilliseconds - b.startEpochMilliseconds);

    let divisor: number = 1;
    for (let i = 0; i < sortedEvents.length - 1; i++) {
        if (sortedEvents[i].endEpochMilliseconds > sortedEvents[i+1].startEpochMilliseconds) {
            divisor++;
        }
    }

    const eventWidth: number = 100 / divisor;
    let col: number = 0;
    let lastEndTime: number = Number.MIN_VALUE;
    return (
        <Grid container className={classes.root} direction="row">
            <Typography className={classes.hourTitle}>{date.getHours()}</Typography>
            <Grid item className={classes.eventsContainer}>
                {sortedEvents.map(e => {
                    const startTimeDate: Date = new Date(e.startEpochMilliseconds);
                    if (e.startEpochMilliseconds < lastEndTime) {
                        col++;
                    }
                    lastEndTime = e.endEpochMilliseconds;  

                    if (Math.floor(e.startEpochMilliseconds / 3600000) === hoursEpochHours) {
                        return <Box
                            key={e.id.toString()}
                            className={classes.calendarContainer}
                            style={{
                                height: hourEntryHeight * ((e.endEpochMilliseconds - e.startEpochMilliseconds) / 3600000),
                                width: `${eventWidth}%`,
                                left: `${eventWidth * col}%`,
                                top: `${100 * (startTimeDate.getMinutes() / 60)}%`,
                            }}>
                            <UserCalendarEvent event={e} />
                        </Box>;
                    }
                    
                    return '';
                })}
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(UserCalendarHourEntry);