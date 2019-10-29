import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import People from '../components/People';

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        height: '100%',
    },
});

interface IProps extends WithStyles<typeof styles> {
}

const PeoplePage: React.FC<IProps> = ({
    classes,
}) => {
    return (
        <div className={classes.root}>
            <People />
        </div>
    );
}
  
export default withStyles(styles)(PeoplePage);