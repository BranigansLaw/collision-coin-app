import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee } from '../../store/attendee';
import { IProfile } from '../../store/profile';
import 'react-image-crop/dist/ReactCrop.css';
import { ab2str } from '../../util';
import CropProfileImageModal from './CropProfileImageModal';
import AttendeeAvatar from '../AttendeeAvatar';
import { Box } from '@material-ui/core';
import FlexGrow from '../UserInterface/FlewGrow';

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        marginTop: theme.spacing(1.5),
    },
    changeButton: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    toDisplay: IAttendee | IProfile;
}

const ProfileImage: React.FC<IProps> = ({
    classes,
    toDisplay,
}) => {
    const [imageData, setImageData] = React.useState<string | undefined>(undefined);
    const [croppedImageData, setCroppedImageData] = React.useState<string | undefined>(undefined);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length === 1) {
            const loadedImage: File = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                if (reader.result === null) {
                    setImageData(undefined);
                    return;
                }

                let dataString: string = '';
                if (typeof reader.result === 'string') {
                    dataString = reader.result;
                }
                else {
                    dataString = ab2str(reader.result);
                }

                setImageData(dataString);
            });
            reader.readAsDataURL(loadedImage);
        }
    }

    const setCroppedImage = (data: string) => {
        setCroppedImageData(data);
        setImageData(undefined);
    }

    const isProfile: boolean = 'qrCodeBase64Data' in toDisplay;
    if (isProfile) {
        return (
            <>
                <input
                    className={classes.changeButton}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile} />
                <CropProfileImageModal
                    imageData={imageData} 
                    cropCompleteCallback={(data: string) => setCroppedImage(data)}
                    cropCancelCallback={() => setImageData(undefined)}
                />
            </>);    
    }
    else {
        return (
            <Box className={classes.root}>
                <FlexGrow />
                <AttendeeAvatar
                    size="large"
                    attendee={toDisplay}
                />
                <FlexGrow />
            </Box>);
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfileImage));