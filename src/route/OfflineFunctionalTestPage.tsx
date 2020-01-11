import React from 'react';
import { Box, WithStyles, createStyles, withStyles, Paper, Typography, Button } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import LoginForm from '../components/Login/LoginForm';
import { logoutActionCreator } from '../store/auth';
import { IOfflineAppState } from '../store';
import { updateProfileActionCreator } from '../store/profile';
import { Guid } from 'guid-typescript';
import { skipWaiting } from '..';
import { ApiAction, ApiActions } from '../store/sync';

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
    actions: ApiAction<ApiActions>[];
    online: boolean;
    updateAvailable: boolean;
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
    updateAvailable,
    logout,
    updateProfileRandomly,
}) => {
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
            <Typography>Online Status</Typography>
                <Typography>{online ? 'ONLINE' : 'OFFLINE'}</Typography>
            </Paper>
            <Paper>
                <Typography>Service Worker Status</Typography>
                <Typography>{updateAvailable ? 'Update Available' : 'Up to Date'}</Typography>
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
                <Button onClick={() => updateProfileRandomly()}>Add Request to Queue</Button>
            </Paper>
            <Paper>
                <Button onClick={() => {
                    skipWaiting();
                }}>Skip Waiting</Button>
            </Paper>
            <Paper>
                <Typography id="updateMessage" className={classes.updateMessage}>Update Available</Typography>
            </Paper>
            <Paper>
                <Typography>Outbox</Typography>
                {actions.map(action => (
                    <Box key={action.transactionId.toString()}>
                        Offline Meta: {JSON.stringify(action)}
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}

const mapStateToProps = (store: IOfflineAppState) => {
    return {
        lastSyncEpochMilliseconds: store.sync.lastSyncEpochMilliseconds,
        currentlySyncing: store.offline.outbox.filter(item => item.type === 'GetDataSync').length > 0,
        authenticated: store.authState.authToken !== undefined,
        actions: store.sync.actionQueue,
        online: store.offline.online,
        updateAvailable: store.serviceWorker.updateAvailable,
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