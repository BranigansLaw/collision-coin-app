import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { headerHeight, RootUrls } from '.';
import { IProfile } from '../store/profile';
import MainMenu from './MainMenu';
import Walletbar from './Walletbar';
import AppBarWithHidden from '../components/UserInterface/AppBarWithHidden';

const styles = (theme: Theme) => createStyles({
    header: {
        height: headerHeight,
    },
    avatar: {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        fontSize: theme.spacing(2),
        fontWeight: 600,
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
    },
});

interface IProps extends WithStyles<typeof styles> {
    profile: IProfile | null;
    location: string;
}

const Navbar: React.FC<IProps> = ({
    profile,
    location,
    classes,
}) => {
    if (profile !== null) {    
        return (
            <AppBarWithHidden position="fixed" className={classes.header} hidden={location === RootUrls.firstDataSync()}>
                <MainMenu profile={profile} />
                <Walletbar />
            </AppBarWithHidden>
        );
    }
    else {
        return <></>;
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
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Navbar));