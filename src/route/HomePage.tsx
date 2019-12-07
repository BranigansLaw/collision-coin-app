import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { IAttendee } from '../store/attendee';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    attendees: IAttendee[];
    lastSync: number;
}

const HomePage: React.FC<IProps> = ({
    classes,
    attendees,
    lastSync,
}) => {
    return (
        <div className={classes.root}>
            <div>
                Last Sync: {lastSync}
            </div>
            {attendees.map(a => (
                <div key={a.id.toString()}>
                    {a.firstName} {a.lastName} from {a.companyName}
                </div>
            ))}
        </div>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        attendees: store.attendeesState.connections,
        lastSync: store.sync.lastSyncEpochMilliseconds,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomePage));