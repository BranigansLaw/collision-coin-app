import red from '@material-ui/core/colors/red';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { purple } from '@material-ui/core/colors';

export const disabledCSS = {
    opacity: 0.4,
    cursor: 'context-menu',
}

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        type: 'dark',
        error: {
            main: red.A400,
        },
        background: {
            default: '#262633',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                backgroundColor: '#262633',
                borderRadius: 20,
                border: 10,
                borderColor: 'black',
                color: 'black',
                height: 48,
                boxShadow: '-8px -8px 32px 0px rgba(245, 245, 245 , .2), 8px 8px 32px 0px rgba(0, 0, 0 , .3)',
                margin: '10px',
            },
        }
    }
});

export default theme;