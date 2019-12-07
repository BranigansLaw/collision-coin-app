import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    redemptionCode: string;
}

const ThirdPartyAuthCallbackPage: React.FC<IProps> = ({
    classes,
    redemptionCode,
}) => {
    return (
        <div className={classes.root}>
            Third Party Callback Page. Hold on this page till the given redemption code is validated and a JWT token is returned<br />
            {redemptionCode}
        </div>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        attendees: store.attendeesState.connections,
        lastSync: store.sync.lastSyncEpochMilliseconds,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThirdPartyAuthCallbackPage));