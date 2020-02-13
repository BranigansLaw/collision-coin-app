import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import DataSyncSlideshow from '../components/DataSyncSlideshow/DataSyncSlideshow';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
}

const FirstDataSyncInProgressPage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <>
            <DataSyncSlideshow />
        </>
    );
}

export default withStyles(styles)(FirstDataSyncInProgressPage);