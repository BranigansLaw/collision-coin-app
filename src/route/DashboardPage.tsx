import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Box, Typography, Button } from '@material-ui/core';
import { fireTestActionCreator } from '../store/wallet';

const styles = (theme: Theme) => createStyles({
    root: {
    },
    qrCode: {
        width: 400,
        height: 400,
        backgroundSize: 'cover',
    },
});

interface IProps extends WithStyles<typeof styles> {
    myQrCode: string | undefined;
    addCoins: () => void;
}

const DashboardPage: React.FC<IProps> = ({
    myQrCode,
    addCoins,
    classes,
}) => {
    return (
        <div className={classes.root}>
            Dashboard
            <Button onClick={() => addCoins()}>Add Coins</Button>
            <Box>
                <Typography variant="h4">My Code</Typography>
                <div hidden={myQrCode === undefined} className={classes.qrCode} style={{backgroundImage: `url(${myQrCode})`}} />
            </Box>
        </div>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        myQrCode: store.profile.userProfile ? store.profile.userProfile.qrCodeBase64Data : undefined,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        addCoins: () => dispatch(fireTestActionCreator()),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(DashboardPage));