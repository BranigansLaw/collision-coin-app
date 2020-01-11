import React from 'react';
import { Typography, WithStyles, createStyles, withStyles, Theme, Paper } from '@material-ui/core';
import ThirdPartyAuthButton from '../components/Login/ThirdPartyAuthButton';
import { ThirdParty } from '../store/auth';
import LoginForm from '../components/Login/LoginForm';

const styles = (theme: Theme) => createStyles({
    root: {
        textAlign: 'center',
    },
    loginPane: {
        marginTop: '2em',
        padding: theme.spacing(2),
        display: 'inline-block',
        boxShadow: theme.shadows[3],
    },
});

interface IProps extends WithStyles<typeof styles> {
    id: string | undefined;
    code: string | undefined;
}

const LoginPage: React.FC<IProps> = ({
    id,
    code,
    classes,
}) => {
    return (
        <div className={classes.root}>
            <Paper className={classes.loginPane}>
                <Typography variant="h5">
                    {id === undefined ? 'Login' : 'Register'}
                </Typography>
                <LoginForm userId={id} registrationCode={code} />
                <ThirdPartyAuthButton authType={ThirdParty.Google} userId={id} registrationCode={code} />
                <ThirdPartyAuthButton authType={ThirdParty.LinkedIn} userId={id} registrationCode={code} />
            </Paper>
        </div>
    );
}

export default withStyles(styles)(LoginPage);