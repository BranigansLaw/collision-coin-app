import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee, updateAttendeeCollisionNotesActionCreator } from '../../store/attendee';
import { Table, TableBody, Box, Grid } from '@material-ui/core';
import { IProfile, isProfile } from '../../store/profile';
import EditProfile from '../EditProfile/EditProfile';
import AttendeeFieldDisplay from './AttendeeFieldDisplay';
import ProfileImage from './ProfileImage';
import { stringNullEmptyOrUndefined } from '../../util';
import HideableTextArea from '../UserInterface/HideableTextArea';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import ButtonWithText from '../UserInterface/ButtonWithText';

const styles = (theme: Theme) => createStyles({
    notes: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
    editing: boolean;
    updateAttendeeCollisionNotes: (collisionId: string, updatedNotes: string) => void;
}

const AttendeeCollisionBody: React.FC<IProps> = ({
    classes,
    toDisplay,
    editing,
    updateAttendeeCollisionNotes,
}) => {
    const [notesValue, setNotesValue] = React.useState<string>("");

    React.useEffect(() => {
        if ('userNotes' in toDisplay) {
            if (stringNullEmptyOrUndefined(toDisplay.userNotes)) {
                setNotesValue("");
            }
            else {
                setNotesValue(toDisplay.userNotes);
            }
        }
        else {
            setNotesValue("");
        }
    }, [toDisplay]);
    
    const isProfileRes: boolean = isProfile(toDisplay);

    return (
        <>
            <Box>
                <ProfileImage toDisplay={toDisplay} />
            </Box>
            {'approvalState' in toDisplay && toDisplay.approvalState === 'New' ?
                <Grid container justify="center">
                    <ButtonWithText color="secondary" aria-label="approve connection" text="Approve" onClick={() => alert('Approve')}>
                        <CheckIcon />
                    </ButtonWithText>
                    <ButtonWithText color="secondary" aria-label="deny connection" text="Deny" onClick={() => alert('Deny')}>
                        <ClearIcon />
                    </ButtonWithText>
                </Grid> : <></>
            }
            <Box hidden={(editing && isProfileRes)}>
                <Table>
                    <TableBody>
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="Email" fieldSelector={(p : IProfile | IAttendee) => p.email} />
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="LinkedIn" fieldSelector={(p : IProfile | IAttendee) => p.linkedInUsername} />
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="Bio" fieldSelector={(p : IProfile | IAttendee) => p.description} />
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="Division" fieldSelector={(p : IProfile | IAttendee) => p.companyDivision} />
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="Phone" fieldSelector={(p : IProfile | IAttendee) => p.phoneNumber} />
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="Skype Username" fieldSelector={(p : IProfile | IAttendee) => p.skype} />
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="Website" fieldSelector={(p : IProfile | IAttendee) => p.website} />
                        <AttendeeFieldDisplay toDisplay={toDisplay} fieldName="Address" fieldSelector={(p : IProfile | IAttendee) => p.address} />
                    </TableBody>
                </Table>
                {'userNotes' in toDisplay ?
                    <HideableTextArea
                        className={classes.notes}
                        label="Notes"
                        multiline
                        value={notesValue}
                        onChange={e => updateAttendeeCollisionNotes(toDisplay.id.toString(), e.target.value)}
                    /> : <></>}
            </Box>
            <Box hidden={!editing || !isProfileRes}>
                <EditProfile hideSubmit={true} />
            </Box>
        </>);
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
)(AttendeeCollisionBody));