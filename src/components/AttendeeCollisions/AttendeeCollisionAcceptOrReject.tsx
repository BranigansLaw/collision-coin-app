import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee, ApprovalState, updateAttendeeCollisionApprovalStateActionCreator } from '../../store/attendee';
import { Grid } from '@material-ui/core';
import { IProfile } from '../../store/profile';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import ButtonWithText from '../UserInterface/ButtonWithText';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
    updateAttendeeApproval: (id: string, newState: ApprovalState) => void;
}

const AttendeeCollisionAcceptOrReject: React.FC<IProps> = ({
    classes,
    toDisplay,
    updateAttendeeApproval,
}) => {
    if ('approvalState' in toDisplay && toDisplay.approvalState === 'New') {
        return (
            <Grid container justify="center">
                <ButtonWithText
                    color="secondary"
                    aria-label="approve connection"
                    text="Approve"
                    onClick={() => updateAttendeeApproval(toDisplay.id, 'Approved')}
                >
                    <CheckIcon />
                </ButtonWithText>
                <ButtonWithText
                    color="secondary"
                    aria-label="deny connection"
                    text="Deny"
                    onClick={() => updateAttendeeApproval(toDisplay.id, 'Block')}
                >
                    <ClearIcon />
                </ButtonWithText>
            </Grid>);
    }
    else {
        return <></>;
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        updateAttendeeApproval: (id: string, newState: ApprovalState) => dispatch(updateAttendeeCollisionApprovalStateActionCreator(id, newState)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttendeeCollisionAcceptOrReject));