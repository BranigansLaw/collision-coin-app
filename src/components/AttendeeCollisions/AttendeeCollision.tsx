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
    TableCell,
    TableBody,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    TextField,
    Grid,
    Fab,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { IProfile } from '../../store/profile';
import TableRowWithHidden from '../UserInterface/TableRowWithHidden';
import AttendeeAvatar from '../AttendeeAvatar';
import CreateIcon from '@material-ui/icons/Create';
import FabWithHidden from '../UserInterface/FabWithHidden';

const avatarWidth = 28;
const avatarRightPadding = 10;
const buttonsWidth = 40;
const headerItemPadding = 8;

const styles = (theme: Theme) => createStyles({
    root: {
        margin: theme.spacing(2),
    },
    details: {
        display: 'block',
    },
    heading: {
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    notes: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    avatar: {
        maxWidth: `${avatarWidth}px`,
        marginRight: `${avatarRightPadding}px`,
        padding: `${headerItemPadding}px`,
    },
    nameAndTitle: {
        width: `calc(100% - ${avatarWidth}px - ${buttonsWidth}px - ${avatarRightPadding}px - ${headerItemPadding * 2}px)`,
    },
    headerButtons: {
        maxWidth: `${buttonsWidth}px`,
    },
    lastButton: {
        marginTop: theme.spacing(1),
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
    expanded: boolean;
    onChange: (attendeeId: string | false) => void;
    updateAttendeeCollisionNotes: (collisionId: string, updatedNotes: string) => void;
}

const AttendeeCollision: React.FC<IProps> = ({
    classes,
    toDisplay,
    expanded,
    onChange,
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
        <ExpansionPanel 
            expanded={expanded}
            onChange={() => onChange(toDisplay.id)}
            className={classes.root}>
            <ExpansionPanelSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Grid container spacing={2} direction="row" justify="flex-start" alignItems="center">
                    <Grid item className={classes.avatar}>
                        <AttendeeAvatar attendee={toDisplay} />
                    </Grid>
                    <Grid item className={classes.nameAndTitle}>
                        <Grid container direction="column" justify="center" alignItems="flex-start">
                            <Grid item>
                                <Typography className={classes.heading}>{`${toDisplay.firstName} ${toDisplay.lastName}`}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography 
                                    hidden={toDisplay.position === null || toDisplay.companyName === null}
                                    variant="subtitle2" 
                                    className={classes.secondaryHeading}>
                                    {`${toDisplay.position} at ${toDisplay.companyName}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.headerButtons}>
                        <FabWithHidden size="small" onClick={() => onChange(toDisplay.id)} hidden={expanded}>
                            <ExpandMoreIcon />
                        </FabWithHidden>
                        <FabWithHidden size="small" onClick={() => alert('Edit Profile')} hidden={!isProfile || !expanded}>
                            <CreateIcon />
                        </FabWithHidden>
                    </Grid>
                </Grid>
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
                            <TableCell align="right">{toDisplay.linkedInUsername}</TableCell>
                        </TableRowWithHidden>
                    </TableBody>
                </Table>
                {showNotes(toDisplay)}
                <Grid className={classes.lastButton} container direction="row" justify="flex-start" alignItems="center">
                    <div className={classes.grow} />
                    <Fab size="small" onClick={() => onChange(false)}>
                        <ExpandLessIcon />
                    </Fab>
                </Grid>
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