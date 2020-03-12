import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Paper, Box, Button } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { getCroppedImg, resizeImage } from '../../imageUtil';
import FlexGrow from '../UserInterface/FlewGrow';
import LoadingButton from '../UserInterface/LoadingButton';

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
        width: '100%',
    },
    buttons: {
        display: 'flex',
    },
    zoomSlider: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: `calc(100% - (2 * ${theme.spacing(2)}px))`,
        color: theme.palette.primary.contrastText,
    },
});

interface IProps extends WithStyles<typeof styles> {
    imageData: string | undefined;
    cropCompleteCallback: (data: string) => void;
    cropCancelCallback: () => void;
}

interface ICrop {
    x: number;
    y: number;
}

const CropProfileImageModal: React.FC<IProps> = ({
    imageData,
    cropCompleteCallback,
    cropCancelCallback,
    classes,
}) => {
    const [crop, setCrop] = React.useState<ICrop>({x:0, y:0});
    const [cropping, setCropping] = React.useState<boolean>(false);
    const [zoom, setZoom] = React.useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);

    const onCropChange = (crop: ICrop) => {
        setCrop(crop);
    }

    const sliderSetZoom = (zoom: number | number[]) => {
        if (zoom instanceof Array) {
            setZoom(zoom[0]);
        }
        else {
            setZoom(zoom);
        }
    }

    const onCropComplete = React.useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const cropImage = React.useCallback(async () => {
        if (imageData === undefined) {
            return;
        }

        setCropping(true);
        try {
            const croppedImage: string | null = await getCroppedImg(
                imageData,
                croppedAreaPixels,
            );

            if (croppedImage === null) {
                throw new Error('Error cropping image');
            }

            const resizedImage: string | null =
                await resizeImage(
                    croppedImage,
                    {width: 200, height: 200},
                );

            if (resizedImage !== null) {
                cropCompleteCallback(resizedImage);
            }
            else {
                throw new Error("Resize returned null");
            }
        } catch (e) {
            console.error(e);
        }
        setCropping(false);
    }, [imageData, croppedAreaPixels, cropCompleteCallback]);

    return (
        <Modal
            className={classes.root}
            aria-labelledby="profile-image-crop"
            open={imageData !== undefined}
        >
            <Paper className={classes.container}>
                <Cropper
                    image={imageData}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={onCropChange}
                    onZoomChange={(zoom: number) => setZoom(zoom)}
                    onCropComplete={onCropComplete}
                />
                <Box className={classes.buttonPane}>
                    <Slider
                        className={classes.zoomSlider}
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e: React.ChangeEvent<{}>, zoom: number | number[]) => sliderSetZoom(zoom)}
                    />
                    <Box className={classes.buttons}>
                        <LoadingButton loading={cropping} onClick={() => cropImage()}>
                            {cropping ? 'Loading...' : 'Crop'}
                        </LoadingButton>
                        <FlexGrow />
                        <Button onClick={() => cropCancelCallback()}>Cancel</Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
}

export default withStyles(styles)(CropProfileImageModal);