import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import MyCode from '../components/MyQrCode/MyCode';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
}

const MyCodePage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <>
            <MyCode />
        </>
    );
}

export default withStyles(styles)(MyCodePage);