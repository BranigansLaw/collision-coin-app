import React from 'react';
import { Box, WithStyles, createStyles, withStyles, Paper, Typography, Button } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import LoginForm from '../components/Login/LoginForm';
import { logoutActionCreator } from '../store/auth';
import { IOfflineAppState } from '../store';
import { Outbox, OfflineAction } from '@redux-offline/redux-offline/lib/types';
import { updateProfileActionCreator } from '../store/profile';
import { Guid } from 'guid-typescript';
import { skipWaiting, update } from '..';

const ComponentWithLocalState: React.FC = () => {
    const [val, setVal] = React.useState('default value');

    return (
        <Box>
            Value = {val}
            <Button onClick={() => setVal('new value')}>Click Me</Button>
        </Box>
    );
}

const styles = (theme: Theme) => createStyles({
    root: {
    },
    updateMessage: {
        display: 'none',
        '&.updated': {
            display: 'block',
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    lastSyncEpochMilliseconds: number;
    currentlySyncing: boolean;
    authenticated: boolean;
    actions: Outbox;
    online: boolean;
    logout: () => void;
    updateProfileRandomly: () => void;
}

const OfflineFunctionalTestPage: React.FC<IProps> = ({
    classes,
    lastSyncEpochMilliseconds,
    currentlySyncing,
    authenticated,
    actions,
    online,
    logout,
    updateProfileRandomly,
}) => {
    const deleteQueueItem = (toDelete: OfflineAction) => {
        toDelete.meta.offline.effect = {};
    }

    return (
        <Box>
            <Typography>Offline Testing Area</Typography>
            <Paper>
                <LoginForm />
            </Paper>
            <Paper>
                <Button onClick={() => logout()}>Logout</Button>
            </Paper>
            <Paper>
                <Typography>{online ? 'ONLINE' : 'OFFLINE'}</Typography>
            </Paper>
            <Paper>
                <ComponentWithLocalState />
            </Paper>
            <Paper>
                <Typography>Sync Variables</Typography>
                <Typography>lastSyncEpochMilliseconds = {lastSyncEpochMilliseconds}</Typography>
                <Typography>currentlySyncing = {currentlySyncing ? 'True' : 'False'}</Typography>
            </Paper>
            <Paper>
                <Typography>Auth Variables</Typography>
                <Typography>authenticated = {authenticated ? 'True' : 'False'}</Typography>
            </Paper>
            <Paper>
                <Button onClick={() => updateProfileRandomly()}>Add Update Request</Button>
            </Paper>
            <Paper>
                <Typography>Update the app</Typography>
                <Button onClick={() => {
                    update();
                }}>Update</Button>
            </Paper>
            <Paper>
                <Button onClick={() => {
                    skipWaiting();
                }}>Skip Waiting</Button>
            </Paper>
            <Paper>
                <Typography id="updateMessage" className={classes.updateMessage}>Update Available!</Typography>
            </Paper>
            <Paper>
                <Typography>Outbox</Typography>
                {actions.map(action => (
                    <Box key={action.meta.transaction}>
                        Offline Meta: {JSON.stringify(action)}
                        <Button onClick={() => deleteQueueItem(action)}>Delete</Button>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        lastSyncEpochMilliseconds: store.sync.lastSyncEpochMilliseconds,
        currentlySyncing: store.sync.currentlySyncing,
        authenticated: store.authState.authToken !== undefined,
        actions: store.offline.outbox,
        online: store.offline.online,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        logout: () => dispatch(logoutActionCreator()),
        updateProfileRandomly: () => dispatch(updateProfileActionCreator(Guid.create().toString(), Guid.create().toString())),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(OfflineFunctionalTestPage));