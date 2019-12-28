import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Typography, Button } from '@material-ui/core';
import EditProfile from '../components/EditProfile/EditProfile';
import { profileIsValid } from '../store/profile';
import { RootUrls } from '.';
import { push } from 'connected-react-router';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    profileIsValid: boolean;
    push: (url: string) => void;
}

const EditProfilePage: React.FC<IProps> = ({
    classes,
    profileIsValid,
    push,
}) => {
    return (
        <>
            <Typography>Edit Profile</Typography>
            <Button size="small"
                variant="contained"
                color="secondary" 
                aria-label="return to dashboard" 
                onClick={() => push(RootUrls.dashboard())}
                disabled={!profileIsValid}>
                Return to Dashboard
            </Button>
            <EditProfile />
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        profileIsValid: profileIsValid(store.profile.userProfile),
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (url: string) => dispatch(push(url)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditProfilePage));