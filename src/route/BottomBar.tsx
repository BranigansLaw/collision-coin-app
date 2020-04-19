import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Toolbar, Fab } from '@material-ui/core';
import { RootUrls } from '.';
import { IProfile } from '../store/profile';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PeopleIcon from '@material-ui/icons/People';
import ButtonWithText from '../components/UserInterface/ButtonWithText';
import { push } from 'connected-react-router';
import AppBarWithHidden from '../components/UserInterface/AppBarWithHidden';
import QrCodeIcon from '../assets/svg/QrCodeIcon';
import FlexGrow from '../components/UserInterface/FlewGrow';

export const scanButtonSize: number = 9;
export const barPadding: number = 3;

const styles = (theme: Theme) => createStyles({
    root: {
        top: 'auto',
        bottom: 0,
        height: theme.spacing(scanButtonSize + barPadding),
        justifyContent: 'center',
    },
    navbarOffset: {
        height: theme.spacing(scanButtonSize + barPadding),
    },
    scanButton: {
        width: theme.spacing(scanButtonSize),
        height: theme.spacing(scanButtonSize),
        "& svg": {
            fontSize: theme.spacing(scanButtonSize - 5),
        },
    },
    footer: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
});

interface IProps extends WithStyles<typeof styles> {
    profile: IProfile | null;
    location: string;
    push: (url: string) => void;
}

const BottomBar: React.FC<IProps> = ({
    classes,
    profile,
    location,
    push,
}) => {
    if (profile !== null) {
        return (
            <>
                <div className={classes.navbarOffset} hidden={location === RootUrls.firstDataSync()} />
                <AppBarWithHidden position="fixed" className={classes.root} hidden={location === RootUrls.firstDataSync()}>
                    <Toolbar>
                        <ButtonWithText color="secondary" aria-label="contacts list" text="Contacts" onClick={() => push(RootUrls.attendeeCollisions())}>
                            <PeopleIcon />
                        </ButtonWithText>
                        <FlexGrow />
                        <Fab color="primary" aria-label="scan" className={classes.scanButton} onClick={() => push(RootUrls.qrCodeScan())}>
                            <QrCodeIcon />
                        </Fab>
                        <FlexGrow />
                        <ButtonWithText color="secondary" aria-label="calendar of events" text="Calendar" onClick={() => push(RootUrls.calendar())}>
                            <CalendarTodayIcon />
                        </ButtonWithText>
                    </Toolbar>
                </AppBarWithHidden>
            </>
        );
    }
    else {
        return (                
            <footer className={classes.footer}>
                &copy; {process.env.REACT_APP_APP_NAME} {new Date().getFullYear()}
            </footer>);
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        profile: store.profile.userProfile,
        location: store.router.location.pathname,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (url: string) => dispatch(push(url)),
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(BottomBar));