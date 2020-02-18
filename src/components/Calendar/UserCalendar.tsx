import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { Typography } from '@material-ui/core';
import { IEvent } from '../../store/calendar';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

/*
        const startDay = `${weekdayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`
        const startHour = date.getHours();
*/

interface IProps extends WithStyles<typeof styles> {
    calendar: IEvent[];
}

const UserCalendar: React.FC<IProps> = ({
    classes,
    calendar,
}) => {
    const calendarDict: { [ date: number ]: { [ hour: number ]: IEvent[] } } = {};
    calendar.map(e => {
        const date: Date = new Date(e.startTimeEpochMilliseconds);
        const day = calendarDict[date.getDate()];
        if (day === undefined) {
            calendarDict[date.getDate()] = { [ date.getHours() ]: [ e ] };
        }
        else {
            const hour = day[date.getHours()];
            if (hour === undefined) {
                day[date.getHours()] = [ e ];
            }
            else {
                day[date.getHours()].push(e);
            }
        }
    });

    debugger;

    return (
        <>
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        calendar: store.calendarState.events,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserCalendar));