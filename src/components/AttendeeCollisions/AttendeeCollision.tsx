import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee, updateAttendeeCollisionNotesActionCreator } from '../../store/attendee';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme: Theme) => createStyles({
    root: {
        margin: theme.spacing(2),
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
    collision: IAttendee;
    updateAttendeeCollisionNotes: (collisionId: string, updatedNotes: string) => void;
}

const AttendeeCollision: React.FC<IProps> = ({
    classes,
    collision,
    updateAttendeeCollisionNotes,
}) => {
    return (
        <ExpansionPanel className={classes.root}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className={classes.heading}>{`${collision.firstName} ${collision.lastName}`}</Typography>
                <Typography 
                    hidden={collision.position === null || collision.companyName === null}
                    variant="subtitle2" 
                    className={classes.secondaryHeading}>
                    {`${collision.position} at ${collision.companyName}`}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Typography>{collision.emailAddress}</Typography>
                <TextField
                    className={classes.notes}
                    label="Notes"
                    placeholder="Notes"
                    multiline
                    value={collision.userNotes}
                    onChange={e => updateAttendeeCollisionNotes(collision.id.toString(), e.target.value)}
                />
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