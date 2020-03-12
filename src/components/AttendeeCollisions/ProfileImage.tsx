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

const styles = (theme: Theme) => createStyles({
    root: {
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

    const isProfile: boolean = 'qrCodeBase64Data' in toDisplay;

    return (
        <>
            <input
                className={classes.changeButton}
                type="file"
                accept="image/*"
                onChange={onSelectFile} />
            <CropProfileImageModal
                imageData={imageData} 
                cropCompleteCallback={(data: string) => setCroppedImageData(data)}
                cropCancelCallback={() => setImageData(undefined)}
            />
            <img src={croppedImageData} />
        </>);
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