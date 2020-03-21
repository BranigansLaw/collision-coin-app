import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Box, Typography } from '@material-ui/core';
import { IAppState } from '../store';
import { IAttendeeRedemption } from '../store/redemption';
import AttendeeRedemption from '../components/AttendeeRedemption/AttendeeRedemption';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
});

interface IProps extends WithStyles<typeof styles> {
    redemptions: IAttendeeRedemption[];
    appRedemptionIdToDisplay: string;
}

const AttendeeRedemptionPage: React.FC<IProps> = ({
    redemptions,
    appRedemptionIdToDisplay,
    classes,
}) => {
    const [toDisplay, setToDisplay] = React.useState<IAttendeeRedemption | undefined>(undefined);

    React.useEffect(() => {
        const toDisplay = redemptions.filter(r => r.appRedemptionId.toLowerCase() === appRedemptionIdToDisplay.toLowerCase());
        if (toDisplay.length === 1) {
            setToDisplay(toDisplay[0]);
        }
        else {
            setToDisplay(undefined);
        }
    }, [redemptions, appRedemptionIdToDisplay, setToDisplay]);

    if (toDisplay !== undefined) {
        return (
            <AttendeeRedemption toDisplay={toDisplay} />
        );
    }
    else {
        return <Box>
            <Typography>There was an error retrieving a redemption with id {appRedemptionIdToDisplay}</Typography>
        </Box>;
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        redemptions: store.redemptionState.redemptions,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttendeeRedemptionPage));