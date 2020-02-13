import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { usePrevious } from '../usePrevious';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    val: number;
}

const RunningCounter: React.FC<IProps> = ({
    val,
    classes,
}) => {
    const [startTimestampEpochMilliseconds, setStartTimestampEpochMilliseconds] = React.useState<number | undefined>(undefined);
    const [curr, setCurr] = React.useState<number>(val);
    const updateCurr = () => {
        setCurr(curr + 10);

        if (curr < val) {
            setInterval(updateCurr, 100);
        }
    };

    const prevBalance: number | undefined = usePrevious(val);
    if (prevBalance !== val && prevBalance !== undefined) {
        updateCurr();
    }

    return (
        <>
            {curr}
        </>
    );
}

export default withStyles(styles)(RunningCounter);