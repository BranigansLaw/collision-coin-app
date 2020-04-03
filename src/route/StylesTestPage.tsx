import React from 'react';
import { WithStyles, createStyles, withStyles, Button, Fab, Paper } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import LoadingButton from '../components/UserInterface/LoadingButton';
import NewLogoIcon from '../assets/svg/NewLogoIcon';

const styles = (theme: Theme) => createStyles({
    newLogo: {
        fontSize: theme.spacing(12),
        '& > #bLine': {
            color: 'red',
        },
        '& > #glass': {
            color: 'purple',
        },
        '& > #bigC': {
            color: 'green',
        },
    },
    newLogo2: {
        fontSize: theme.spacing(12),
        color: 'pink',
    }
});

interface IProps extends WithStyles<typeof styles> {
}

const StylesTestPage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <>
            <NewLogoIcon className={classes.newLogo} />
            <NewLogoIcon className={classes.newLogo2} />
            <Paper>
                Orange Box
            </Paper>
            <Paper>
                Green Box
            </Paper>
            <Paper>
                Blue Box
            </Paper>
            <Button color="primary" variant="contained" size="small" onClick={() => alert('Click')}>Button Primary Small Contained</Button>
            <Button color="primary" variant="contained" size="large" onClick={() => alert('Click')}>Button Primary Large Contained</Button>
            <Button color="secondary" variant="contained" size="small" onClick={() => alert('Click')}>Button Secondary Small Contained</Button>
            <Button color="secondary" variant="contained" size="large" onClick={() => alert('Click')}>Button Secondary Large Contained</Button>
            <Button color="default" variant="contained" size="small" onClick={() => alert('Click')}>Button Default Small Contained</Button>
            <Button color="default" variant="contained" size="large" onClick={() => alert('Click')}>Button Default Large Contained</Button>
            <LoadingButton loading={true}>Loading</LoadingButton>
            <LoadingButton loading={false}>Not Loading</LoadingButton>
            <Fab 
                size="small"
                color="primary" 
                aria-label="add" 
                type="submit">
                <AddToPhotosIcon />
            </Fab>
            <Fab 
                size="large"
                color="primary" 
                aria-label="add" 
                type="submit">
                <AddToPhotosIcon />
            </Fab>
        </>
    );
}

export default withStyles(styles)(StylesTestPage);