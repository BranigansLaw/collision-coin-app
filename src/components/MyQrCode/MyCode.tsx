import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import CodeDisplay from './CodeDisplay';
import { Box } from '@material-ui/core';
import { headerHeight, walletBarHeight } from '../../route';
import { scanButtonSize, barPadding } from '../../route/BottomBar';

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        height: `calc(100vh - ${headerHeight} - ${walletBarHeight} - ${theme.spacing(scanButtonSize + barPadding)}px)`,
        textAlign: 'center',
        padding: theme.spacing(3),
    },
});

interface IProps extends WithStyles<typeof styles> {
    myQrCode: string | undefined;
}

const MyCode: React.FC<IProps> = ({
    myQrCode,
    classes,
}) => {
    return (
        <Box className={classes.root}>
            <CodeDisplay myQrCode={myQrCode} />
        </Box>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        myQrCode: store.profile.userProfile ? store.profile.userProfile.qrCodeBase64Data : undefined,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyCode));