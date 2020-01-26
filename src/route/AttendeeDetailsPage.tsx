import React from 'react';
import { Table, TableRow, TableCell, TableBody, CircularProgress, Box, Avatar, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { IAttendee } from '../store/attendee';
import { Guid } from 'guid-typescript';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const avatarSize = 175;
const avatarBorderWidth = 5;
const styles = (theme: Theme) => createStyles({
    root: {
        textAlign: 'center',
    },
    container: {
        backgroundColor: '#982745',
        color: 'white',
        borderRadius: '20px',
        margin: '20px',
    },
    avatarContainer: {
        display: 'inline-block',
    },
    avatar: {
        width: `${avatarSize - (avatarBorderWidth * 2)}px`,
        height: `${avatarSize - (avatarBorderWidth * 2)}px`,
        borderRadius: '100%',
        borderColor: 'white',
        borderWidth: `${avatarBorderWidth}px`,
        borderStyle: 'solid',
        backgroundColor: theme.palette.grey[300],
    },
    loadingCircleContainer: {
        position: 'absolute',
        top: 0,
    },
});

interface IProps extends WithStyles<typeof styles> {
    attendees: IAttendee[];
    viewingAttendeeId: string;
}

const AttendeeDetailsPage: React.FC<IProps> = ({
    attendees,
    viewingAttendeeId,
    classes,
}) => {
    if (Guid.isGuid(viewingAttendeeId)) {
        const viewingAttendeeGuid: Guid = Guid.parse(viewingAttendeeId);
        const attendeeSearch: IAttendee | undefined = attendees.find(a => a.id.toString() ===  viewingAttendeeGuid.toString());

        if (attendeeSearch !== undefined) {
            const attendee: IAttendee = attendeeSearch;

            return (
                <Box className={classes.root}>
                    <Box className={classes.container}>
                        <Box>
                            <Box className={classes.avatarContainer}>
                                <Box hidden={!true}>
                                    <PermIdentityIcon className={classes.avatar} />
                                    <Box className={classes.loadingCircleContainer}>
                                        <CircularProgress size={avatarSize} />
                                    </Box>
                                </Box>
                                <Box hidden={false}>
                                    <Avatar className={classes.avatar}
                                            alt={`Avatar Placeholder`} 
                                            src="https://i2.wp.com/tylerfindlay.com/wp-content/uploads/2014/07/cropped-1236380_10100252656487375_106899236_n.jpg" />
                                </Box>
                            </Box>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Name</TableCell>
                                        {attendee.firstName === undefined ? 
                                            <TableCell align="right">{attendee.name}</TableCell> :
                                            <TableCell align="right">{attendee.firstName} {attendee.lastName}</TableCell>}
                                    </TableRow>
                                    <TableRow hidden={attendee.emailAddress === undefined}>
                                        <TableCell component="th" scope="row">Email</TableCell>
                                        <TableCell align="right">{attendee.emailAddress}</TableCell>
                                    </TableRow>
                                    <TableRow hidden={attendee.companyName === undefined}>
                                        <TableCell component="th" scope="row">Company</TableCell>
                                        <TableCell align="right">{attendee.companyName}</TableCell>
                                    </TableRow>
                                    <TableRow hidden={attendee.position === undefined}>
                                        <TableCell component="th" scope="row">Position</TableCell>
                                        <TableCell align="right">{attendee.position}</TableCell>
                                    </TableRow>
                                    <TableRow hidden={attendee.linkedInUsername === undefined}>
                                        <TableCell component="th" scope="row">LinkedIn Username</TableCell>
                                        <TableCell align="right">{attendee.linkedInUsername}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                </Box>
            );
        }
        else {
            return <div>Invalid Attendee Id</div>;
        }
    }
    else {
        return <div>Invalid Attendee Id</div>;
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        attendees: store.attendeesState.collisions,
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    {},
)(AttendeeDetailsPage));