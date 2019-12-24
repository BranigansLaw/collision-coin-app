import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Typography } from '@material-ui/core';
import { startSyncIntervalActionCreator } from '../store/sync';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    startSync: () => void;
}

const EditProfilePage: React.FC<IProps> = ({
    classes,
    startSync,
}) => {
    startSync();
    return (
        <>
            <Typography>First Data Sync In Progress</Typography>  
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        startSync: () => dispatch(startSyncIntervalActionCreator()),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditProfilePage));