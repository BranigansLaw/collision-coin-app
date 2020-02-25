import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IEvent } from '../../store/calendar';
import { Box, Typography, Grid } from '@material-ui/core';
import UserCalendarEvent from './UserCalendarEvent';

const hourEntryHeight: number = 84;
const styles = (theme: Theme) => createStyles({
    root: {
        height: hourEntryHeight,
        position: 'relative',
    },
    calendarContainer: {
        position: 'absolute',
    },
});

interface IProps extends WithStyles<typeof styles> {
    hoursEpochHours: number;
    events: IEvent[];
}

interface IColumnTimespan {
    events: IEvent[];
}

const UserCalendarHourEntry: React.FC<IProps> = ({
    hoursEpochHours,
    events,
    classes,
}) => {
    const date: Date = new Date(hoursEpochHours * 3600000);
    const sortedEvents: IEvent[] = events.sort((a, b) => a.startTimeEpochMilliseconds - b.startTimeEpochMilliseconds);
    

    let divisor: number = 1;
    for (let i = 0; i < sortedEvents.length - 1; i++) {
        if (sortedEvents[i].endTimeEpochMilliseconds > sortedEvents[i+1].startTimeEpochMilliseconds) {
            divisor++;
        }
    }

    const eventWidth: number = 100 / divisor;
    let col: number = 0;
    let lastEndTime: number = Number.MIN_VALUE;
    return (
        <Grid container className={classes.root} direction="row">
            <Typography>{date.getHours()}</Typography>
            {sortedEvents.map(e => {
                const startTimeDate: Date = new Date(e.startTimeEpochMilliseconds);
                if (e.startTimeEpochMilliseconds < lastEndTime) {
                    col++;
                }
                lastEndTime = e.endTimeEpochMilliseconds;  

                if (Math.floor(e.startTimeEpochMilliseconds / 3600000) === hoursEpochHours) {
                    return <Box
                        key={e.id.toString()}
                        className={classes.calendarContainer}
                        style={{
                            height: hourEntryHeight * ((e.endTimeEpochMilliseconds - e.startTimeEpochMilliseconds) / 3600000),
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
    );
}

export default withStyles(styles)(UserCalendarHourEntry);