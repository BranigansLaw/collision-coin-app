import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Typography } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
}

const DashboardPage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <>
            <Typography variant="h5">
                Welcome to the first public test of Conference-Quest.
            </Typography>
            <Typography variant="subtitle1">
                Thank you so much for being part of this test! 
            </Typography>
            <Typography variant="body1">
                Be sure to come back and redeem your points for beer!
            </Typography>
            <Typography variant="body1">
                We have a lot of great features on our road-map, but right now we are testing a couple of the functions with your help.
            </Typography>
            <Typography variant="body2">
                You can create an account and profile.
            </Typography>
            <Typography variant="body2">
                You can scan other peoples QR codes by using the scan button at the bottom of the screen.
            </Typography>
            <Typography variant="body2">
                In the Top Left of the page you can access your QR code which will allow others to scan your phone screen and connect with you.
            </Typography>
            <Typography variant="body2">
                Your scanned contacts are accessible via the Contacts Button and the calendar of events is available with the calendar button.
            </Typography>
            <Typography variant="body2">
                Again, Thank you so much and enjoy the beer.
            </Typography>
            <Typography variant="h5">
                - Tyler and Howard
            </Typography>
        </>
    );
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
)(DashboardPage));