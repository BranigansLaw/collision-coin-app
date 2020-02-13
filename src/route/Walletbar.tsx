import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Typography, Grid, Paper } from '@material-ui/core';
import { walletBarHeight } from '.';
import { muiPaperOutlinedOverride } from '../theme';
import RunningCounter from '../components/RunningCounter';

const styles = (theme: Theme) => createStyles({
    root: {
        height: `calc(${walletBarHeight} - ${muiPaperOutlinedOverride.borderWidth * 2}px - ${muiPaperOutlinedOverride.margin * 2}px - ${muiPaperOutlinedOverride.padding * 2}px)`,
        overflow: 'hidden',
    },
});

interface IProps extends WithStyles<typeof styles> {
    balance: number;
}

const Walletbar: React.FC<IProps> = ({
    balance,
    classes,
}) => {
    return (
        <Paper variant="outlined">
            <Grid container justify="center" alignItems="center" className={classes.root}>
                <Grid container direction="row" justify="center" alignItems="flex-end">
                    <Typography variant="h3"><RunningCounter val={balance} /></Typography>
                    <Typography variant="subtitle1">Coins</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        balance: store.wallet.balance,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Walletbar));