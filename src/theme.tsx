import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

export const disabledCSS = {
    opacity: 0.4,
    cursor: 'context-menu',
}

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            main: 'purple',
        },
        secondary: {
            main: 'blue',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: 'white',
        },
    },
});

export default theme;