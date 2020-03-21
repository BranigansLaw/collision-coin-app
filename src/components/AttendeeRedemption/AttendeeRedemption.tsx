import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Box, Typography, CircularProgress, Grid } from '@material-ui/core';
import { IAppState } from '../../store';
import { IAttendeeRedemption } from '../../store/redemption';
import { Guid } from 'guid-typescript';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import GridWithHidden from '../UserInterface/GridWithHidden';
import TimeSince from '../UserInterface/TimeSince';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    },
    loading: {
        paddingRight: theme.spacing(1),
        '& .MuiCircularProgress-svg': {
            color: theme.palette.primary.contrastText,
        }
    }
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendeeRedemption;
}

const AttendeeRedemption: React.FC<IProps> = ({
    toDisplay,
    classes,
}) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (toDisplay.id === Guid.EMPTY) {
            setIsLoading(true);
        }
        else {
            setIsLoading(false);
        }
    }, [toDisplay, setIsLoading]);

    return <Box className={classes.root}>
        <Grid container alignItems="center" justify="center" direction="column">
            <Grid className={classes.loading} item>
                <Grid container alignItems="center" direction="row">
                    {isLoading ? <CircularProgress /> : <CheckCircleIcon fontSize="large" />}
                    <Typography variant="h4">Purchase Status</Typography>
                </Grid>
            </Grid>
            <Grid item>
                <Typography>{toDisplay.redemptionItemName} for {toDisplay.amount}</Typography>
            </Grid>
            <GridWithHidden hidden={isLoading} item>
                <Typography>Purchased <TimeSince sinceEpochMilliseconds={toDisplay.updatedDateTimeEpochMilliseconds} /> ago</Typography>
            </GridWithHidden>
        </Grid>
    </Box>;
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttendeeRedemption));