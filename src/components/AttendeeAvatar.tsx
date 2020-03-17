import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Avatar } from '@material-ui/core';
import { IAttendeeBaseFields } from '../store/attendee';
import CoinLogo from '../assets/svg/CoinLogo';

const styles = (theme: Theme) => createStyles({
    avatar: {
        fontWeight: 600,
        borderColor: theme.palette.primary.contrastText,
        borderWidth: 1,
        borderStyle: 'solid',
        '& .MuiSvgIcon-root': {
            color: 'rgb(230, 116, 0)',
        },
    },
    small: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
        fontSize: theme.spacing(2.5),
        '& .MuiSvgIcon-root': {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
    },
    large: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        fontSize: theme.spacing(10),
    },
});

interface IProps extends WithStyles<typeof styles> {
    attendee: IAttendeeBaseFields | null;
    size?: 'small' | 'large';
}

const AttendeeAvatar: React.FC<IProps> = ({
    attendee,
    size,
    classes,
}) => {
    let sizeClass: string = classes.small;
    if (size !== undefined) {
        sizeClass = size === 'large' ? classes.large : classes.small;
    }

    const src: string | undefined = attendee !== null && attendee.profilePictureBase64Data ? attendee.profilePictureBase64Data : undefined;
    const alt: string = attendee !== null ? `Profile image for ${attendee.firstName[0]} ${attendee.lastName[0]}` : 'Collision Coin';
    const children: JSX.Element = attendee !== null ? 
        <>{attendee.firstName[0]}{attendee.lastName[0]}</> : 
        <CoinLogo />;

    return <Avatar
        className={`${classes.avatar} ${sizeClass}`}
        alt={alt}
        src={src}
    >
        {children}
    </Avatar>;
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
)(AttendeeAvatar));