import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { withResizeDetector } from 'react-resize-detector';

const styles = (theme: Theme) => createStyles({
    root: {
    },
    qrCode: {
        backgroundSize: 'cover',
        display: 'inline-block',
    },
});

interface IProps extends WithStyles<typeof styles> {
    myQrCode: string | undefined;
}

type Props =
    IProps & {
        height: number;
        width: number;
    };

const MyCode: React.FC<Props> = ({
    myQrCode,
    width,
    height,
    classes,
}) => {
    return (
        <div
            hidden={myQrCode === undefined}
            className={classes.qrCode}
            style={{
                backgroundImage: `url(${myQrCode})`,
                width: Math.min(width, height),
                height: Math.min(width, height),
            }} />
    );
}

export default withStyles(styles)(withResizeDetector(MyCode));