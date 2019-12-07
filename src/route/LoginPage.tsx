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
    id: string | null;
    code: string | null;
}

const LoginPage: React.FC<IProps> = ({
    id,
    code,
}) => {
    return (
        <div>
            <h1>{id === undefined ? 'Login' : 'Register'}</h1>
            <ThirdPartyAuthButton authType={ThirdParty.Google} userId={id} registrationCode={code} />
            <ThirdPartyAuthButton authType={ThirdParty.LinkedIn} userId={id} registrationCode={code} />
        </div>
    );
}

export default withStyles(styles)(LoginPage);