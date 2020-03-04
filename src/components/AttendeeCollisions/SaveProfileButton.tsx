import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { EditProfileFormName } from '../EditProfile/EditProfile';
import { submit, FormAction } from 'redux-form';
import SaveIcon from '@material-ui/icons/Save';
import { Fab } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
    editProfileState: any,
    saveProfileChanges: () => FormAction;
    closeFormCallback: () => void;
}

const SaveProfileButton: React.FC<IProps> = ({
    classes,
    editProfileState,
    saveProfileChanges,
    closeFormCallback,
}) => {
    const saveProfile = () => {
        saveProfileChanges();
        closeFormCallback();
    }

    const noValidationErrors = editProfileState !== undefined && editProfileState.syncErrors === undefined;
    let anyFieldDifferent = false;
    if (noValidationErrors && editProfileState.initial !== undefined && editProfileState.values !== undefined) {
        for (const key in editProfileState.initial) {
            anyFieldDifferent = anyFieldDifferent || editProfileState.initial[key] !== editProfileState.values[key];
        }
    }

    return (
        <Fab
            size="small"
            disabled={!noValidationErrors || !anyFieldDifferent}
            onClick={() => saveProfile()}>
            <SaveIcon />
        </Fab>);
}

const mapStateToProps = (store: IAppState) => {
    return {
        editProfileState: store.form[EditProfileFormName],
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        saveProfileChanges: () => dispatch(submit(EditProfileFormName)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(SaveProfileButton));