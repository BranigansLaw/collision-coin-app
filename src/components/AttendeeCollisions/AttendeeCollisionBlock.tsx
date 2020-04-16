import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee, ApprovalState, updateAttendeeCollisionApprovalStateActionCreator } from '../../store/attendee';
import { Grid, Switch, FormControlLabel } from '@material-ui/core';
import { IProfile } from '../../store/profile';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
    updateAttendeeApproval: (id: string, newState: ApprovalState) => void;
}

const AttendeeCollisionBlock: React.FC<IProps> = ({
    classes,
    toDisplay,
    updateAttendeeApproval,
}) => {
    const blockToggle = React.useCallback((newState: ApprovalState) => {
        updateAttendeeApproval(toDisplay.id, newState);
    }, [toDisplay.id, updateAttendeeApproval]);

    if ('approvalState' in toDisplay && toDisplay.approvalState !== 'New') {
        return (
            <Grid container justify="center">
                <FormControlLabel
                    control={
                    <Switch
                        checked={toDisplay.approvalState === 'Block'}
                        onChange={() => blockToggle(toDisplay.approvalState === 'Approved' ? 'Block' : 'Approved')}
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label={toDisplay.approvalState === 'Block' ? 'Unblock' : 'Block'}
                />
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
)(AttendeeCollisionBlock));