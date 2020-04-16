import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee } from '../../store/attendee';
import { Box, Fab } from '@material-ui/core';
import { IProfile, isProfile, profileIsValid } from '../../store/profile';
import CreateIcon from '@material-ui/icons/Create';
import FabWithHidden from '../UserInterface/FabWithHidden';
import { EditProfileFormName } from '../EditProfile/EditProfile';
import { reset } from 'redux-form';
import CancelIcon from '@material-ui/icons/Cancel';
import NeonPaper from '../UserInterface/NeonPaper';
import SaveProfileButton from './SaveProfileButton';
import AttendeeCollisionHeader from './AttendeeCollisionHeader';
import AttendeeCollisionBody from './AttendeeCollisionBody';
import AttendeeCollisionAboutContent from './AttendeeCollisionAboutContent';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const styles = (theme: Theme) => createStyles({
    root: {
        height: theme.spacing(10),
    },
    lastButton: {
        marginTop: theme.spacing(1),
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile | null;
    expandedDefault: boolean;
    openEditing?: boolean;
    resetProfileChanges: () => void;
}

const AttendeeCollision: React.FC<IProps> = ({
    classes,
    toDisplay,
    expandedDefault,
    openEditing,
    resetProfileChanges,
}) => {
    const [expanded, setExpanded] = React.useState<boolean>(expandedDefault);
    const [editing, setEditing] = React.useState<boolean>(openEditing !== undefined && openEditing);

    const startEditing = () => {
        setEditing(true);
        setExpanded(true);
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
    
    const isProfileRes: boolean = toDisplay !== null && isProfile(toDisplay);

    const isPending: boolean = React.useMemo(() => 
        toDisplay !== null && 'approvalState' in toDisplay && toDisplay.approvalState === 'New',
        [toDisplay]);

    let headerButtons: JSX.Element[] = [
        (<FabWithHidden key="edit-button" size="small" onClick={() => startEditing()} hidden={!isProfileRes || editing}>
            <CreateIcon />
        </FabWithHidden>),
        (<FabWithHidden key="cancel-button" size="small" onClick={() => cancelProfileChanges()} hidden={!isProfileRes || !editing || !profileIsValid(toDisplay)}>
            <CancelIcon />
        </FabWithHidden>),
    ];

    if (isProfileRes && editing) {
        headerButtons = [
            <SaveProfileButton 
                key="save-button"
                closeFormCallback={saveProfile} />,
            ...headerButtons
        ];
    }

    if (isPending) {
        headerButtons = [
            (<Fab key="approve-button" size="small" onClick={() => alert('approve')}>
                <CheckIcon />
            </Fab>),
            (<Fab key="deny-button" size="small" onClick={() => alert('deny')}>
                <ClearIcon />
            </Fab>),
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
            headerButtons={headerButtons}
        >
            <AttendeeCollisionHeader toDisplay={toDisplay} />
            <Box hidden={!expanded}>
                {toDisplay !== null ?
                    <AttendeeCollisionBody toDisplay={toDisplay} editing={editing} /> :
                    <AttendeeCollisionAboutContent />}
            </Box>
        </NeonPaper>);
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        resetProfileChanges: () => dispatch(reset(EditProfileFormName))
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttendeeCollision));