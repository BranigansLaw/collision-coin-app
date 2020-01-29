import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/styles';
import { Theme, WithStyles } from '@material-ui/core';
import { history } from '../store';
import { ConnectedRouter } from 'connected-react-router';
import QrCodeReaderPage from './QrCodeReaderPage';
import AttendeeDetailsPage from './AttendeeDetailsPage';
import LoginPage from './LoginPage';
import ThirdPartyAuthCallbackPage from './ThirdPartyAuthCallbackPage';
import DashboardPage from './DashboardPage';
import ThirdPartyAuthErrorPage from './ThirdPartyAuthErrorPage';
import AuthenticatedRoute from './AuthenticatedRoute';
import Navbar from './Navbar';
import EditProfilePage from './EditProfilePage';
import FirstDataSyncInProgress from './FirstDataSyncInProgress';
import OfflineFunctionalTestPage from './OfflineFunctionalTestPage';
import StylesTestPage from './StylesTestPage';
import AttendeeCollisionsPage from './AttendeeCollisionsPage';
import BottomBar from './BottomBar';
import CalendarPage from './CalendarPage';

// min height of 48 to work with AppBar
export const headerHeight: string = '48px';
export const footerHeight: string = '20px';
export const footerPadding: string = '10px';

export class RootUrls {
    public static readonly login = () => '/login';
    public static readonly calendar = () => '/calendar';
    public static readonly qrCodeScan = () => '/scan';    
    public static readonly attendeeDetails = (id: string): string => `/attendee/${id}`;
    public static readonly thirdPartyAuth = (): string => '/thirdPartyAuth';
    public static readonly dashboard = (): string => '/dashboard';
    public static readonly firstDataSync = (): string => '/first-data-sync';
    public static readonly userProfile = (): string => '/profile';
    public static readonly attendeeCollisions = (id?: string): string => `/attendee-collisions${id ? `/${id}` : ''}`
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
                    <Route exact path='/' render={route => <Redirect to={RootUrls.dashboard()} />} />
                    <AuthenticatedRoute exact path={RootUrls.dashboard()} component={DashboardPage} />
                    <Route exact path={RootUrls.login()} component={LoginPage} />
                    <Route exact path='/register' render={route => {
                        const search = window.location.search;
                        const params = new URLSearchParams(search);
                        const id: string | null = params.get('id');
                        const code: string | null = params.get('code');

                        return <LoginPage id={id !== null ? id : undefined} code={code !== null ? code : undefined} />;
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
                    <AuthenticatedRoute exact path={RootUrls.qrCodeScan()} component={QrCodeReaderPage} />
                    <AuthenticatedRoute exact path={RootUrls.calendar()} component={CalendarPage} />
                    <AuthenticatedRoute exact path={RootUrls.userProfile()} component={EditProfilePage} />
                    <AuthenticatedRoute exact path={RootUrls.firstDataSync()} component={FirstDataSyncInProgress} />
                    <AuthenticatedRoute exact path={RootUrls.attendeeCollisions()} component={AttendeeCollisionsPage} />
                    <AuthenticatedRoute exact path={RootUrls.attendeeCollisions(':id')} render={route => <AttendeeCollisionsPage openedCollisionId={route.match.params.id} />} />
                    <Route exact path={RootUrls.attendeeDetails(':id')} render={route => <AttendeeDetailsPage viewingAttendeeId={route.match.params.id} />} />
                    <Route exact path='/offline-app-testing-area' component={OfflineFunctionalTestPage} />
                    <Route exact path='/styles-test-page' component={StylesTestPage} />
                    <AuthenticatedRoute exact path='/offline-app-testing-area-auth' component={OfflineFunctionalTestPage} />
                </main>
                <BottomBar />
            </ConnectedRouter>
        </div>
    );
}

export default withStyles(styles)(AppRoute);