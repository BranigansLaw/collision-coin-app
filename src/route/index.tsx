import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/styles';
import { Theme, WithStyles } from '@material-ui/core';
import { history } from '../store';
import { ConnectedRouter } from 'connected-react-router';
import QrCodeReaderPage from './QrCodeReaderPage';
import LoginPage from './LoginPage';
import ThirdPartyAuthCallbackPage from './ThirdPartyAuthCallbackPage';
import DashboardPage from './DashboardPage';
import ThirdPartyAuthErrorPage from './ThirdPartyAuthErrorPage';
import AuthenticatedRoute from './AuthenticatedRoute';
import Navbar from './Navbar';
import FirstDataSyncInProgress from './FirstDataSyncInProgressPage';
import OfflineFunctionalTestPage from './OfflineFunctionalTestPage';
import StylesTestPage from './StylesTestPage';
import AttendeeCollisionsPage from './AttendeeCollisionsPage';
import BottomBar from './BottomBar';
import CalendarPage from './CalendarPage';
import MyCodePage from './MyCodePage';
import UnauthenticatedRoute from './UnauthenticatedRoute';
import { CollisionCoinId } from '../components/AttendeeCollisions/AttendeeCollisionList';
import HelpPage from './HelpPage';
import UnsubscribePage from './UnsubscribePage';
import CurrentRedemptionPage from './CurrentRedemptionPage';
import AttendeeRedemptionPage from './AttendeeRedemptionPage';
import AdminDashboard from './AdminDashboard';
import { adminPageRoles } from '../store/auth';
import AddAttendeeToStartupTntPage from './AddAttendeeToStartupTntPage';

// min height of 48 to work with AppBar
export const headerHeight: string = '48px';
export const walletBarHeight: string = '105px';

export class RootUrls {
    public static readonly login = () => '/login';
    public static readonly calendar = () => '/calendar';
    public static readonly myCode = () => '/my-code';    
    public static readonly qrCodeScan = () => '/scan';    
    public static readonly thirdPartyAuth = (): string => '/thirdPartyAuth';
    public static readonly dashboard = (): string => '/dashboard';
    public static readonly adminDashboard = (): string => '/admin-dashboard';
    public static readonly firstDataSync = (): string => '/first-data-sync';
    public static readonly about = (): string => '/about';
    public static readonly help = (): string => '/help';
    public static readonly unsubscribe = (): string => '/unsubscribe-success';
    public static readonly attendeeCollisions = (id?: string, editOpen?: boolean): string => `/attendee-collisions${id ? `/${id}` : ''}${editOpen && id ? '/edit' : ''}`;
    public static readonly currentRedemption = (): string => '/current-redemption';
    public static readonly attendeeRedemption = (appRedemptionId: string): string => `/redemption/${appRedemptionId}`;
}

const styles = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
        maxWidth: 600,
        margin: '0 auto',
    },
    main: {
        minHeight: '100%',
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
                    <AuthenticatedRoute exact path={RootUrls.adminDashboard()} component={AdminDashboard} requiredRoles={adminPageRoles} />
                    <UnauthenticatedRoute exact path={RootUrls.login()} component={LoginPage} />
                    <UnauthenticatedRoute exact path='/register' render={route => {
                        const search = window.location.search;
                        const params = new URLSearchParams(search);
                        const id: string | null = params.get('id');
                        const code: string | null = params.get('code');

                        return <LoginPage id={id !== null ? id : undefined} code={code !== null ? code : undefined} />;
                    }} />
                    <Route exact path='/tnt' component={AddAttendeeToStartupTntPage} />
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
                    <AuthenticatedRoute exact path={RootUrls.myCode()} component={MyCodePage} />
                    <AuthenticatedRoute exact path={RootUrls.qrCodeScan()} component={QrCodeReaderPage} />
                    <AuthenticatedRoute exact path={RootUrls.calendar()} component={CalendarPage} />
                    <AuthenticatedRoute exact path={RootUrls.firstDataSync()} component={FirstDataSyncInProgress} />
                    <AuthenticatedRoute exact path={RootUrls.attendeeCollisions()} component={AttendeeCollisionsPage} />
                    <AuthenticatedRoute exact path={RootUrls.attendeeCollisions(':id')} render={route => <AttendeeCollisionsPage openedCollisionId={route.match.params.id} />} />
                    <AuthenticatedRoute exact path={RootUrls.attendeeCollisions(':id', true)}
                        render={route => <AttendeeCollisionsPage openedCollisionId={route.match.params.id} editing={true} />} />
                    <AuthenticatedRoute exact path={RootUrls.about()} render={route => <AttendeeCollisionsPage openedCollisionId={CollisionCoinId} />} />
                    <AuthenticatedRoute exact path={RootUrls.help()} component={HelpPage} />
                    <Route exact path={RootUrls.unsubscribe()} component={UnsubscribePage} />
                    <Route exact path='/offline-app-testing-area' component={OfflineFunctionalTestPage} />
                    <Route exact path='/styles-test-page' component={StylesTestPage} />
                    <AuthenticatedRoute exact path='/offline-app-testing-area-auth' component={OfflineFunctionalTestPage} />
                    <AuthenticatedRoute exact path={RootUrls.currentRedemption()} component={CurrentRedemptionPage} />
                    <AuthenticatedRoute exact path={RootUrls.attendeeRedemption(':id')}
                        render={route => <AttendeeRedemptionPage appRedemptionIdToDisplay={route.match.params.id} />} />
                </main>
                <BottomBar />
            </ConnectedRouter>
        </div>
    );
}

export default withStyles(styles)(AppRoute);