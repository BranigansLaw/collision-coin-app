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
    qrCode: string;
}

type Props =
    IProps & {
        height: number;
        width: number;
    };

const ResizableCode: React.FC<Props> = ({
    qrCode,
    width,
    height,
    classes,
}) => {
    return (
        <div
            className={classes.qrCode}
            style={{
                backgroundImage: `url(${qrCode})`,
                width: Math.min(width, height),
                height: Math.min(width, height),
            }} />
    );
}

export default withStyles(styles)(withResizeDetector(ResizableCode));