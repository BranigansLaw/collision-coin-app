import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../store';
import { Avatar } from '@material-ui/core';
import { IAttendeeBaseFields } from '../store/attendee';

const styles = (theme: Theme) => createStyles({
    avatar: {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        fontSize: theme.spacing(2),
        fontWeight: 600,
        borderColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
    },
});

interface IProps extends WithStyles<typeof styles> {
    attendee: IAttendeeBaseFields | null;
}

const AttendeeAvatar: React.FC<IProps> = ({
    attendee,
    classes,
}) => {
    if (attendee !== null && attendee.profilePictureBase64Data) {
        return <Avatar className={classes.avatar} alt="Remy Sharp" src={attendee.profilePictureBase64Data} />;
    }
    else if (attendee !== null) {
        return <Avatar className={classes.avatar}>{attendee.firstName[0]}{attendee.lastName[0]}</Avatar>;
    }
    else {
        return <Avatar className={classes.avatar}>CC</Avatar>;
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
)(AttendeeAvatar));