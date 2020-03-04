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
    Typography,
    TextField,
    Grid,
    Box,
} from '@material-ui/core';
import { IProfile, profileIsValid } from '../../store/profile';
import TableRowWithHidden from '../UserInterface/TableRowWithHidden';
import AttendeeAvatar from '../AttendeeAvatar';
import CreateIcon from '@material-ui/icons/Create';
import FabWithHidden from '../UserInterface/FabWithHidden';
import EditProfile, { EditProfileFormName } from '../EditProfile/EditProfile';
import { reset } from 'redux-form';
import CancelIcon from '@material-ui/icons/Cancel';
import { validNonEmptyString } from '../../util';
import NeonPaper from '../UserInterface/NeonPaper';
import SaveProfileButton from './SaveProfileButton';

const avatarWidth = 28;
const avatarRightPadding = 10;
const buttonsWidth = 40;
const headerItemPadding = 8;

const styles = (theme: Theme) => createStyles({
    root: {
        height: theme.spacing(10),
        overflow: 'hidden',
    },
    header: {
        width: 'initial',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    notes: {
        width: '100%',
    },
    avatar: {
        maxWidth: `${avatarWidth}px`,
        marginRight: `${avatarRightPadding}px`,
        padding: `${headerItemPadding}px`,
    },
    nameAndTitle: {
        width: `calc(100% - ${avatarWidth}px - ${buttonsWidth}px - ${avatarRightPadding}px - ${headerItemPadding * 2}px)`,
    },
    lastButton: {
        marginTop: theme.spacing(1),
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
    expandedDefault: boolean;
    openEditing?: boolean;
    resetProfileChanges: () => void;
    updateAttendeeCollisionNotes: (collisionId: string, updatedNotes: string) => void;
}

const AttendeeCollision: React.FC<IProps> = ({
    classes,
    toDisplay,
    expandedDefault,
    openEditing,
    resetProfileChanges,
    updateAttendeeCollisionNotes,
}) => {
    const [expanded, setExpanded] = React.useState<boolean>(expandedDefault);
    const [editing, setEditing] = React.useState<boolean>(openEditing !== undefined && openEditing);

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
    const startEditing = () => {
        setExpanded(true);
        setEditing(true)
    }

    const cancelProfileChanges = () => {
        resetProfileChanges();
        setEditing(false);
    }

    const saveProfile = () => {
        setEditing(false);
        setExpanded(false);
    }

    const toggleExpanded = () => {
        if (expanded) {
            setEditing(false);
        }

        setExpanded(!expanded)
    }
    
    const isProfile: boolean = 'qrCodeBase64Data' in toDisplay;
    let headerButtons: JSX.Element[] = [
        (<FabWithHidden key="edit-button" size="small" onClick={() => startEditing()} hidden={!isProfile || editing}>
            <CreateIcon />
        </FabWithHidden>),
        (<FabWithHidden key="cancel-button" size="small" onClick={() => cancelProfileChanges()} hidden={!isProfile || !editing || !profileIsValid(toDisplay)}>
            <CancelIcon />
        </FabWithHidden>),
    ];

    if (isProfile && editing) {
        headerButtons = [
            <SaveProfileButton 
                key="save-button"
                closeFormCallback={saveProfile} />,
            ...headerButtons
        ];
    }

    return (
        <NeonPaper
            color="yellow"
            density="normal"
            className={classes.root}
            hasExpander={true}
            expanded={expanded}
            onExpandContractClick={() => toggleExpanded()}
            headerButtons={headerButtons}>
            <Grid spacing={2} className={classes.header} container direction="row" justify="flex-start" alignItems="center">
                <Grid item className={classes.avatar}>
                    <AttendeeAvatar attendee={toDisplay} />
                </Grid>
                <Grid item className={classes.nameAndTitle}>
                    <Grid hidden={true} container direction="column" justify="center" alignItems="flex-start">
                        <Grid item>
                            <Typography>{`${toDisplay.firstName} ${toDisplay.lastName}`}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography 
                                hidden={!validNonEmptyString(toDisplay.position) || !validNonEmptyString(toDisplay.companyName)}
                                variant="subtitle2" 
                                className={classes.secondaryHeading}>
                                {`${toDisplay.position} at ${toDisplay.companyName}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box hidden={editing && isProfile}>
                <Table>
                    <TableBody>
                        <TableRowWithHidden hidden={!isProfile && !validNonEmptyString(toDisplay.email)}>
                            <TableCell component="th" scope="row">Email</TableCell>
                            <TableCell align="right">{toDisplay.email}</TableCell>
                        </TableRowWithHidden>
                        <TableRowWithHidden hidden={!isProfile && !validNonEmptyString(toDisplay.linkedInUsername)}>
                            <TableCell component="th" scope="row">LinkedIn</TableCell>
                            <TableCell align="right">{toDisplay.linkedInUsername}</TableCell>
                        </TableRowWithHidden>
                    </TableBody>
                </Table>
                {showNotes(toDisplay)}
            </Box>
            <Box hidden={!editing || !isProfile}>
                <EditProfile hideSubmit={true} />
            </Box>
        </NeonPaper>);
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        updateAttendeeCollisionNotes: (collisionId: string, updatedNotes: string) => dispatch(updateAttendeeCollisionNotesActionCreator(collisionId, updatedNotes)),
        resetProfileChanges: () => dispatch(reset(EditProfileFormName))
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttendeeCollision));