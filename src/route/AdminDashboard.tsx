import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import AddAttendee from '../components/AddAttendee/AddAttendee';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    },
});

interface IProps extends WithStyles<typeof styles> {
}

const DashboardPage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <div className={classes.root}>
            <AddAttendee />
        </div>
    );
}

export default withStyles(styles)(DashboardPage);