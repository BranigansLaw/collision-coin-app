import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Paper, Box, Button } from '@material-ui/core';
import { withResizeDetector } from 'react-resize-detector';

const buttonPaneHeight: number = 100;

const styles = (theme: Theme) => createStyles({
    root: {
    },
    container: {
        margin: theme.spacing(2),
        width: `calc(100% - ${theme.spacing(2) * 2}px)`,
        height: `calc(100vh - ${theme.spacing(2) * 2}px)`,
        position: 'relative',
    },
    cropContainer: {
        height: `calc(100% - ${buttonPaneHeight}px)`
    },
    buttonPane: {
        position: 'absolute',
        bottom: 0,
    },
});

interface IProps extends WithStyles<typeof styles> {
    imageData: string;
    imageWidth: number;
    imageHeight: number;
}

type Props =
    IProps & {
        height: number;
        width: number;
    };

const CropProfileImageModal: React.FC<Props> = ({
    imageData,
    imageWidth,
    imageHeight,
    width,
    height,
    classes,
}) => {
    const [crop, setCrop] = React.useState<Crop>({});

    React.useEffect(() => {
        setCrop({
            unit: '%',
            aspect: 1,
            width: 50,
            height: 50,
            x: 25,
            y: 25,
        });
    }, [imageData]);

    const getCropperStyle = () => {
        if (width > height) {
            return {
                height: `${height}px`,
            };
        }
        else {
            return {
                height: '100%',
            };
        }
    }

    return (
        <Modal
            className={classes.root}
            aria-labelledby="profile-image-crop"
            open={imageData !== null}
        >
            <Paper className={classes.container}>
                <ReactCrop
                    src={imageData}
                    crop={crop}
                    ruleOfThirds
                    /*onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}*/
                    onChange={(c: any) => setCrop(c)}
                    style={getCropperStyle()}
                    className={classes.cropContainer}
                />
                <Box className={classes.buttonPane}>
                    <Button onClick={() => alert('Crop')}>Crop</Button>
                    <Button onClick={() => alert('Cancel')}>Cancel</Button>
                </Box>
            </Paper>
        </Modal>
    );
}

export default withStyles(styles)(withResizeDetector(CropProfileImageModal));