import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import QrReader from 'react-qr-reader';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
}

const QrCodeReaderPage: React.FC<IProps> = ({
    classes,
}) => {
    const [data, setData] = React.useState("");

    const handleScan = (scannedData: string | null) => {
        if (scannedData !== null) {
            setData(scannedData);
        }
      }

    const handleError = (err: string) => {
        console.error(err)
    }

    return (
        <div className={classes.root}>
            <div>
                {data}
            </div>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan} />
        </div>
    );
}
  
export default withStyles(styles)(QrCodeReaderPage);