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

const AddAttendeeToStartupTntPage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <div className={classes.root}>
            <AddAttendee
                title={`Welcome to Startup TNT! Sign up to use ${process.env.REACT_APP_APP_NAME} here and earn free beers just by connecting with other attendees!`}
                showQrCodeButton={false}
                conferenceId={process.env.REACT_APP_STARTUP_TNT_CONFERENCE_ID}
            />
        </div>
    );
}

export default withStyles(styles)(AddAttendeeToStartupTntPage);