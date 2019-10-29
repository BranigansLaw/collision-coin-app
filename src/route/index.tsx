import React from 'react';
import { Link as RouterLink, Route } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/styles';
import { AppBar, Toolbar, MenuItem, Theme, WithStyles } from '@material-ui/core';
import { history } from '../store';
import { ConnectedRouter } from 'connected-react-router';
import HomePage from './HomePage';
import PeoplePage from './PeoplePage';
import logo from '../logo.svg';

// min height of 48 to work with AppBar
const headerHeight: string = '48px';
const footerHeight: string = '20px';
const footerPadding: string = '10px';

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
        top: '-15px',
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
                                    to="/people">
                            People
                        </MenuItem>
                    </Toolbar>
                </AppBar>
                <main className={classes.main}>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path='/people' component={PeoplePage} />
                </main>
                <footer className={classes.footer}>
                    &copy; New App Inc. {new Date().getFullYear()} - {process.env.NODE_ENV}
                </footer>
            </ConnectedRouter>
        </div>
    );
}

export default withStyles(styles)(AppRoute);