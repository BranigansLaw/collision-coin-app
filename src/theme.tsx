import red from '@material-ui/core/colors/red';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const disabledCSS = {
    opacity: 0.4,
    cursor: 'context-menu',
}

export const muiPaperOutlinedOverride = {
    padding: 16,
    borderRadius: 20,
    borderWidth: 3,
    margin: 8,
};

// The dark theme of this app
export const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        error: {
            main: red.A400,
        },
        primary: {
            main: '#333333',
            contrastText: '#F2F2F2',
        },
        secondary: {
            main: '#262633',
            contrastText: '#E6E6E6',
        },
        background: {
            default: '#262633',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: 20,
                border: 10,
                height: 48,
                boxShadow: '-8px -8px 32px 0px rgba(245, 245, 245 , .2), 8px 8px 32px 0px rgba(0, 0, 0 , .3)',
                margin: '10px',
            },
            containedPrimary: {
                backgroundColor: 'white',
            },
        },
        MuiPaper: {
            outlined: muiPaperOutlinedOverride,
        },
        MuiFormControl: {
            root: {
                width: '100%',
            },
        },
        MuiBadge: {
            badge: {
                color: 'rgb(28, 28, 28)',
            }
        },
    }
});

export const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        error: {
            main: red.A400,
        },
        primary: {
            main: '#F2F2F2',
            contrastText: '#333333',
        },
        secondary: {
            main: '#E6E6E6',
            contrastText: '#333333',
        },
        background: {
            default: '#F2F2F2',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                backgroundColor: '#F2F2F2',
                borderRadius: 20,
                border: 10,
                height: 48,
                boxShadow: '-8px -8px 32px 0px rgba(245, 245, 245 , .2), 8px 8px 32px 0px rgba(0, 0, 0 , .3)',
                margin: '10px',
            },
            containedPrimary: {
                backgroundColor: 'white',
            },
        },
        MuiPaper: {
            outlined: muiPaperOutlinedOverride,
        },
        MuiFormControl: {
            root: {
                width: '100%',
            },
        },
        MuiBadge: {
            badge: {
                color: 'rgb(242, 242, 242)',
            }
        },
        MuiSvgIcon: {
            root: {
                '&.set-colors #glass': {
                    color: '#333333 !important',
                },
            },
        },
    }
});