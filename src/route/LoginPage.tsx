import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import ThirdPartyAuthButton from '../components/Login/ThirdPartyAuthButton';
import { ThirdParty } from '../store/auth';
import { Paper, Typography, Theme } from '@material-ui/core';
import LoginForm from '../components/Login/LoginForm';

const styles = (theme: Theme) => createStyles({
    root: {
        textAlign: 'center',
    },
    loginPane: {
        marginTop: '2em',
        //padding: theme.spacing(5),
        display: 'inline-block',
        //boxShadow: theme.shadows[5],
    },
});

interface IProps extends WithStyles<typeof styles> {
    id: string | null;
    code: string | null;
}

interface IProps extends WithStyles<typeof styles> {
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
                <LoginForm />
                <ThirdPartyAuthButton authType={ThirdParty.Google} userId={id} registrationCode={code} />
                <ThirdPartyAuthButton authType={ThirdParty.LinkedIn} userId={id} registrationCode={code} />
            </Paper>
        </div>
    );
}

export default withStyles(styles)(LoginPage);