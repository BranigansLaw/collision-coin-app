import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import ThirdPartyAuthButton from '../components/ThirdPartyAuthButton';
import { ThirdParty } from '../store/auth';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    email?: string;
}

const LoginPage: React.FC<IProps> = ({
    email
}) => {
    return (
        <div>
            <h1>Login</h1>
            <ThirdPartyAuthButton authType={ThirdParty.Google} registrationEmail={email} />
            <ThirdPartyAuthButton authType={ThirdParty.LinkedIn} registrationEmail={email} />
        </div>
    );
}

export default withStyles(styles)(LoginPage);