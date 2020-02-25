import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IEvent } from '../../store/calendar';
import { Box, Typography } from '@material-ui/core';
import UserCalendarHourEntry from './UserCalendarHourEntry';
import { range } from '../../util';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

interface IProps extends WithStyles<typeof styles> {
    dateEpochDays: number;
    hours: { [ hour: number ]: IEvent[] };
}

const UserCalendarDayEntry: React.FC<IProps> = ({
    dateEpochDays,
    hours,
    classes,
}) => {
    const date: Date = new Date(dateEpochDays * 3600000 * 24);
    let minHour: number = Number.MAX_VALUE;
    let maxHour: number = -1;
    Object.keys(hours).forEach(h => {
        const events: IEvent[] = hours[Number(h)];
        events.forEach(e => {
            if (minHour > e.startTimeEpochMilliseconds) {
                minHour = e.startTimeEpochMilliseconds;
            }
            if (maxHour < e.endTimeEpochMilliseconds) {
                maxHour = e.endTimeEpochMilliseconds;
            }
        });
    });
    minHour = minHour / 3600000;
    maxHour = maxHour / 3600000;

    return (
        <Box className={classes.root}>
            <Typography>{weekdayNames[date.getDay() - 1]}, {monthNames[date.getMonth() - 1]} {date.getDate()}</Typography>
            {range(minHour, maxHour, 1).map((hour: number) =>
                <UserCalendarHourEntry
                    key={hour}
                    hoursEpochHours={hour} 
                    events={hours[hour] !== undefined ? hours[hour] : []} />)}
        </Box>
    );
}

export default withStyles(styles)(UserCalendarDayEntry);