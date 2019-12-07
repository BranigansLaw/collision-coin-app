import React from 'react';
import { Link as RouterLink, Route } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/styles';
import { AppBar, Toolbar, MenuItem, Theme, WithStyles } from '@material-ui/core';
import { history } from '../store';
import { ConnectedRouter } from 'connected-react-router';
import HomePage from './HomePage';
import QrCodeReaderPage from './QrCodeReaderPage';
import logo from '../logo.svg';
import AttendeeDetailsPage from './AttendeeDetailsPage';
import LoginPage from './LoginPage';
import ThirdPartyAuthCallbackPage from './ThirdPartyAuthCallbackPage';

// min height of 48 to work with AppBar
const headerHeight: string = '48px';
const footerHeight: string = '20px';
const footerPadding: string = '10px';

export class RootUrls {
    public static readonly attendeeDetails = (id: string): string => `/attendee/${id}`;
    public static readonly thirdPartyAuth = (redemptionCode: string): string => `/thirdPartyAuth?redemptionCode=${redemptionCode}`;
}

const styles = (theme: Theme) => createStyles({
    root: {
        minHeight: '100%',
        position: 'relative',
    },
    header: {
        height: headerHeight,
    },
    logo: {
        height: 'calc(100% - 1em)',
        margin: '0.5em',
        marginRight: '2em',
    },
    main: {
        minHeight: '100%',
        position: 'relative',
        paddingBottom: `calc(${footerHeight} + (2 * ${footerPadding}))`,
    },
    footer: {
        width: `calc(100% - (2 * ${footerPadding}))`,
        padding: footerPadding,
        height: footerHeight,
        position: 'absolute',
        textAlign: 'center',
        left: 0,
        bottom: 0,
    },
});

interface IProps extends WithStyles<typeof styles> {}

const AppRoute: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <div className={classes.root}>
            <ConnectedRouter history={history}>
                <AppBar position="static"
                        className={classes.header}>
                    <Toolbar variant="dense">
                        <img className={classes.logo} 
                                alt="App Logo"
                                src={logo} />
                        <MenuItem component={RouterLink}
                                    to="/qrcode">
                            QR Reader
                        </MenuItem>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path='/login' component={LoginPage} />
                    <Route exact path='/register/:email/:code' render={route => <LoginPage email={route.match.params.email} />} />
                    <Route exact path={RootUrls.thirdPartyAuth(':redemptionCode')} render={route => <ThirdPartyAuthCallbackPage redemptionCode={route.match.params.redemptionCode} />} />
                    <Route exact path='/qrcode' component={QrCodeReaderPage} />
                    <Route exact path={RootUrls.attendeeDetails(':id')} render={route => <AttendeeDetailsPage viewingAttendeeId={route.match.params.id} />} />
                </main>
                <footer className={classes.footer}>
                    &copy; New App Inc. {new Date().getFullYear()} - {process.env.NODE_ENV}
                </footer>
            </ConnectedRouter>
        </div>
    );
}

export default withStyles(styles)(AppRoute);