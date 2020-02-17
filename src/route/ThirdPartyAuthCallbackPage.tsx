import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { RootUrls } from '.';
import { push } from 'connected-react-router';
import { thirdPartyRedeemTokenActionCreator } from '../store/auth';
import DataSyncSlideshow from '../components/DataSyncSlideshow/DataSyncSlideshow';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    redemptionCode: string;
    authToken: string | undefined;
    push: (url: string) => void;
    redeemCode: (redemptionCode: string) => void;
}

const ThirdPartyAuthCallbackPage: React.FC<IProps> = ({
    classes,
    redemptionCode,
    authToken,
    push,
    redeemCode,
}) => {
    if (authToken !== undefined) {
        push(RootUrls.dashboard());
    }
    else {
        redeemCode(redemptionCode);
    }

    return (
        <>
            <DataSyncSlideshow />
        </>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        authToken: store.authState.authToken,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (url: string) => dispatch(push(url)),
        redeemCode: (redemptionCode: string) => dispatch(thirdPartyRedeemTokenActionCreator(redemptionCode))
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThirdPartyAuthCallbackPage));