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
        },
        secondary: {
            main: '#262633',
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
        },
        secondary: {
            main: '#262633',
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
    }
});