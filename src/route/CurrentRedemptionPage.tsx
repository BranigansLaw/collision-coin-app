import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Box, Typography, Grid, Button } from '@material-ui/core';
import { IAppState } from '../store';
import { IRedeemable } from '../store/redemption';
import { Redirect } from 'react-router-dom';
import { RootUrls } from '.';
import { push } from 'connected-react-router';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
});

interface IProps extends WithStyles<typeof styles> {
    currentRedeemable: IRedeemable | undefined;
    currentBalance: number;
    push: (url: string) => void;
}

const CurrentRedemptionPage: React.FC<IProps> = ({
    currentRedeemable,
    currentBalance,
    push,
    classes,
}) => {
    if (currentRedeemable !== undefined) {
        const insufficientFunds: boolean = currentBalance < (currentRedeemable.cost !== undefined ? currentRedeemable.cost : 0);

        return (
            <Box className={classes.root}>
                <Typography variant="h4">Confirm Purchase?</Typography>
                <Typography variant="h5">{currentRedeemable.name}</Typography>
                <Typography>Cost: {currentRedeemable.cost} Coins</Typography>
                <Grid container justify="center">
                    <Button variant="contained" disabled={insufficientFunds}>Confirm</Button>
                    <Button variant="contained" onClick={() => push(RootUrls.dashboard())}>Cancel</Button>
                </Grid>
                <Typography color="error" hidden={!insufficientFunds}>Insufficient Funds</Typography>
            </Box>
        );
    }
    else {
        return <Redirect to={RootUrls.dashboard()} />;
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        currentRedeemable: store.redemptionState.current,
        currentBalance: store.wallet.balance,
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
)(CurrentRedemptionPage));