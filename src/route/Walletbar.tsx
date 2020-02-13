import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Typography, Grid, Paper } from '@material-ui/core';
import { IProfile } from '../store/profile';
import { walletBarHeight } from '.';
import { muiPaperOutlinedOverride } from '../theme';

const styles = (theme: Theme) => createStyles({
    root: {
        height: `calc(${walletBarHeight} - ${muiPaperOutlinedOverride.borderWidth * 2}px - ${muiPaperOutlinedOverride.margin * 2}px - ${muiPaperOutlinedOverride.padding * 2}px)`,
        overflow: 'hidden',
    },
});

interface IProps extends WithStyles<typeof styles> {
    profile: IProfile | null;
}

const Walletbar: React.FC<IProps> = ({
    profile,
    classes,
}) => {
    if (profile !== null) {        
        return (
            <Paper variant="outlined">
                <Grid container direction="row" justify="center" alignItems="flex-end" className={classes.root}>
                    <Typography variant="h3">4300</Typography>
                    <Typography variant="subtitle1">Coins</Typography>
                </Grid>
            </Paper>
        );
    }
    else {
        return <></>;
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        profile: store.profile.userProfile,
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