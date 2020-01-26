import React from 'react';
import { WithStyles, createStyles, withStyles, Button, Fab, Paper } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
}

const StylesTestPage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <>
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