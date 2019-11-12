import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { syncActionCreator } from '../store/sync';
import { IAppState } from '../store';
import { IAttendee } from '../store/attendee';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    attendees: IAttendee[];
    lastSync: number;
    sync: () => void;
}

const HomePage: React.FC<IProps> = ({
    classes,
    attendees,
    lastSync,
    sync,
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
            <div>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => sync()}>
                        Sync
                </Button>
            </div>
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
        sync: () => dispatch(syncActionCreator()),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomePage));