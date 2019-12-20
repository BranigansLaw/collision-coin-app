import React from 'react';
import { Route } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/styles';
import { Theme, WithStyles } from '@material-ui/core';
import { history } from '../store';
import { ConnectedRouter } from 'connected-react-router';
import HomePage from './HomePage';
import QrCodeReaderPage from './QrCodeReaderPage';
import AttendeeDetailsPage from './AttendeeDetailsPage';
import LoginPage from './LoginPage';
import ThirdPartyAuthCallbackPage from './ThirdPartyAuthCallbackPage';
import DashboardPage from './DashboardPage';
import ThirdPartyAuthErrorPage from './ThirdPartyAuthErrorPage';
import AuthenticatedRoute from './AuthenticatedRoute';
import Navbar from './Navbar';

// min height of 48 to work with AppBar
export const headerHeight: string = '48px';
const footerHeight: string = '20px';
const footerPadding: string = '10px';

export class RootUrls {
    public static readonly login = () => '/login';
    public static readonly attendeeDetails = (id: string): string => `/attendee/${id}`;
    public static readonly thirdPartyAuth = (): string => '/thirdPartyAuth';
    public static readonly dashboard = (): string => '/dashboard';
}

const styles = (theme: Theme) => createStyles({
    root: {
        minHeight: '100%',
        position: 'relative',
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
                <Navbar />
                <main className={classes.main}>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path={RootUrls.login()} component={LoginPage} />
                    <Route exact path='/register' render={route => {
                        const search = window.location.search;
                        const params = new URLSearchParams(search);
                        const id: string | null = params.get('id');
                        const code: string | null = params.get('code');

                        return <LoginPage id={id} code={code} />;
                    }} />
                    <Route exact path={RootUrls.thirdPartyAuth()} render={route => {
                        const search = window.location.search;
                        const params = new URLSearchParams(search);
                        const redemptionCode: string | null = params.get('redemptionCode');
                        
                        if (redemptionCode !== null) {
                            return <ThirdPartyAuthCallbackPage redemptionCode={redemptionCode} />;
                        }
                        else {
                            return <ThirdPartyAuthErrorPage />;
                        }
                    }}/>
                    <AuthenticatedRoute exact path={RootUrls.dashboard()} component={DashboardPage} />
                    <AuthenticatedRoute exact path='/qrcode' component={QrCodeReaderPage} />
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