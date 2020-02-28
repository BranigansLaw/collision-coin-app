import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IEvent } from '../../store/event';
import UserCalendarDayEntry from './UserCalendarDayEntry';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    calendar: IEvent[];
}

const UserCalendar: React.FC<IProps> = ({
    classes,
    calendar,
}) => {
    const calendarDict: { [ date: number ]: { [ hour: number ]: IEvent[] } } = {};
    calendar.forEach(e => {
        const epochHour: number = Math.floor(e.startEpochMilliseconds / 3600000);
        const epcohDay: number = Math.floor(epochHour / 24);

        let currEpochHour = epochHour;
        let finishEpochHour: number = Math.floor(e.endEpochMilliseconds / 3600000);
        while (currEpochHour <= finishEpochHour) {
            const day = calendarDict[epcohDay];
            if (day === undefined) {
                calendarDict[epcohDay] = { [ currEpochHour ]: [ e ] };
            }
            else {
                const hour = day[currEpochHour];
                if (hour === undefined) {
                    day[currEpochHour] = [ e ];
                }
                else {
                    day[currEpochHour].push(e);
                }
            }
            currEpochHour++;
        }
    });

    return (
        <>
            {Object.keys(calendarDict).map((keyStr: string) => {
                const key: number = Number(keyStr);
                return <UserCalendarDayEntry key={key} dateEpochDays={key} hours={calendarDict[key]} />
            })}
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        calendar: store.eventState.events,
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