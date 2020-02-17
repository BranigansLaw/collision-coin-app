import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Toolbar, Fab } from '@material-ui/core';
import { footerPadding, footerHeight, RootUrls } from '.';
import { IProfile } from '../store/profile';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PeopleIcon from '@material-ui/icons/People';
import ButtonWithText from '../components/UserInterface/ButtonWithText';
import CropFreeIcon from '@material-ui/icons/CropFree';
import { push } from 'connected-react-router';
import AppBarWithHidden from '../components/UserInterface/AppBarWithHidden';

const scanButtonSize: number = 11;
const barPadding: number = 3;

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
    grow: {
        flexGrow: 1,
    },
    scanButton: {
        width: theme.spacing(scanButtonSize),
        height: theme.spacing(scanButtonSize),
        "& svg": {
            fontSize: theme.spacing(scanButtonSize - 3),
        },
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
                        <div className={classes.grow} />
                        <Fab color="primary" aria-label="scan" className={classes.scanButton} onClick={() => push(RootUrls.qrCodeScan())}>
                            <CropFreeIcon />
                        </Fab>
                        <div className={classes.grow} />
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
                &copy; Collision Coin Inc. {new Date().getFullYear()} - {process.env.NODE_ENV}
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