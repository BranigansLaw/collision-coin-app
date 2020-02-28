import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { IEvent } from '../../store/event';
import { Box, Typography } from '@material-ui/core';
import UserCalendarHourEntry from './UserCalendarHourEntry';
import { range } from '../../util';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];

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
            if (minHour > e.startEpochMilliseconds) {
                minHour = e.startEpochMilliseconds;
            }
            if (maxHour < e.endEpochMilliseconds) {
                maxHour = e.endEpochMilliseconds;
            }
        });
    });
    minHour = Math.floor(minHour / 3600000);
    maxHour = Math.max(Math.floor(maxHour / 3600000), minHour + 1);

    return (
        <Box className={classes.root}>
            <Typography>{weekdayNames[date.getDay()]}, {monthNames[date.getMonth()]} {date.getDate() + 1}</Typography>
            {range(minHour, maxHour, 1).map((hour: number) =>
                <UserCalendarHourEntry
                    key={hour}
                    hoursEpochHours={hour} 
                    events={hours[hour] !== undefined ? hours[hour] : []} />)}
        </Box>
    );
}

export default withStyles(styles)(UserCalendarDayEntry);