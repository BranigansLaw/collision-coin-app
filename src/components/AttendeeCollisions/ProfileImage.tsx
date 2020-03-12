import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee } from '../../store/attendee';
import { IProfile, isProfile } from '../../store/profile';
import 'react-image-crop/dist/ReactCrop.css';
import { ab2str } from '../../util';
import CropProfileImageModal from './CropProfileImageModal';
import { Guid } from 'guid-typescript';
import LargeCenteredAvatar from './LargeCenteredAvatar';

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        marginTop: theme.spacing(1.5),
    },
    changeButton: {
        opacity: 0,
        position: 'absolute',
        pointerEvents: 'none',
        width: '1px',
        height: '1px',
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

    const elementId: string = Guid.create().toString();
    if (isProfile(toDisplay)) {
        return (
            <>
                <input
                    id={elementId}
                    className={classes.changeButton}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile} />
                <label htmlFor={elementId}>
                    <LargeCenteredAvatar toDisplay={toDisplay} />
                </label>
                <CropProfileImageModal
                    imageData={imageData} 
                    cropCompleteCallback={(data: string) => setCroppedImage(data)}
                    cropCancelCallback={() => setImageData(undefined)}
                />
            </>);    
    }
    else {
        return <LargeCenteredAvatar toDisplay={toDisplay} />;
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