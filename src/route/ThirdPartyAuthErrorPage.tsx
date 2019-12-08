import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { push } from 'connected-react-router';
import { thirdPartyRedeemTokenActionCreator } from '../store/auth';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    push: (url: string) => void;
}

const ThirdPartyAuthErrorPage: React.FC<IProps> = ({
    classes,
    push,
}) => {
    return (
        <div className={classes.root}>
            An error occurred logging you in. Please try again
        </div>
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
)(ThirdPartyAuthErrorPage));