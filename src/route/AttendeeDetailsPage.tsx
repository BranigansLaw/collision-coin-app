import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { IAttendee } from '../store/attendee';
import { Guid } from 'guid-typescript';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    attendees: IAttendee[];
    loading: boolean;
    viewingAttendeeId: string;
}

const AttendeeDetailsPage: React.FC<IProps> = ({
    attendees,
    loading,
    viewingAttendeeId,
    classes,
}) => {
    if (Guid.isGuid(viewingAttendeeId)) {
        const viewingAttendeeGuid: Guid = Guid.parse(viewingAttendeeId);

        return (
            <div className={classes.root}>
                {viewingAttendeeGuid.toString()}
            </div>
        );
    }
    else {
        return <div>Invalid Attendee Id</div>
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        attendees: store.attendeesState.connections,
        loading: store.attendeesState.loading,
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    {},
)(AttendeeDetailsPage));