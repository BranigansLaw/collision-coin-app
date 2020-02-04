import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee, updateAttendeeCollisionNotesActionCreator } from '../../store/attendee';
import {
    Table,
    TableRow,
    TableCell,
    TableBody,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    TextField
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IProfile } from '../../store/profile';
import TableRowWithHidden from '../UserInterface/TableRowWithHidden';

const styles = (theme: Theme) => createStyles({
    root: {
        margin: theme.spacing(2),
    },
    details: {
        display: 'block',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    notes: {
        width: '100%',
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
    updateAttendeeCollisionNotes: (collisionId: string, updatedNotes: string) => void;
}

const AttendeeCollision: React.FC<IProps> = ({
    classes,
    toDisplay,
    updateAttendeeCollisionNotes,
}) => {
    const showNotes = (object: IAttendee | IProfile) => {
        if ('userNotes' in object) {
            return (
                <TextField
                    className={classes.notes}
                    label="Notes"
                    placeholder="Notes"
                    multiline
                    value={object.userNotes}
                    onChange={e => updateAttendeeCollisionNotes(toDisplay.id.toString(), e.target.value)}
                />);
        }
    }

    const isProfile: boolean = 'qrCodeBase64Data' in toDisplay;

    return (
        <ExpansionPanel className={classes.root}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className={classes.heading}>{`${toDisplay.firstName} ${toDisplay.lastName}`}</Typography>
                <Typography 
                    hidden={toDisplay.position === null || toDisplay.companyName === null}
                    variant="subtitle2" 
                    className={classes.secondaryHeading}>
                    {`${toDisplay.position} at ${toDisplay.companyName}`}
                </Typography>
            </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <Table>
                        <TableBody>
                            <TableRowWithHidden hidden={!isProfile && toDisplay.email === null}>
                                <TableCell component="th" scope="row">Email</TableCell>
                                <TableCell align="right">{toDisplay.email}</TableCell>
                            </TableRowWithHidden>
                            <TableRowWithHidden hidden={!isProfile && toDisplay.linkedInUsername === null}>
                                <TableCell component="th" scope="row">LinkedIn</TableCell>
                                <TableCell align="right">{toDisplay.linkedInUsername}{toDisplay.linkedInUsername === null ? 'Null' : ''}</TableCell>
                            </TableRowWithHidden>
                        </TableBody>
                    </Table>
                    {showNotes(toDisplay)}
                </ExpansionPanelDetails>
        </ExpansionPanel>);
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        updateAttendeeCollisionNotes: (collisionId: string, updatedNotes: string) => dispatch(updateAttendeeCollisionNotesActionCreator(collisionId, updatedNotes)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttendeeCollision));