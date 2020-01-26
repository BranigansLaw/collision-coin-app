import React from 'react';
import { Box, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { IAttendee } from '../store/attendee';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
    collisions: IAttendee[];
    openedCollisionId?: string;
}

const AttendeeCollisionsPage: React.FC<IProps> = ({
    collisions,
    openedCollisionId,
    classes,
}) => {
    return (
        <>
            Opened collision: {openedCollisionId}
            {collisions.map(c =>
                <Box key={c.id}>
                    {c.firstName} {c.lastName} - {c.companyName}
                </Box>
            )}
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        collisions: store.attendeesState.collisions,
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    {},
)(AttendeeCollisionsPage));