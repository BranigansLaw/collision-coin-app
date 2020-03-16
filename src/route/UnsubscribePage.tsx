import React from 'react';
import { createStyles, withStyles, Typography, WithStyles, Box } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    },
});

interface IProps extends WithStyles<typeof styles> {}

const UnsubscribePage: React.FC<IProps> = ({
    classes
}) => {
    return (
        <Box className={classes.root}>
            <Typography variant="h3">Sorry to see you go!</Typography>
            <Typography>You have been successfully unsubscribed from all future emails.</Typography>
        </Box>
    );
}

export default withStyles(styles)(UnsubscribePage);