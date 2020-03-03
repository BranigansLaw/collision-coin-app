import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee } from '../../store/attendee';
import AttendeeCollision from './AttendeeCollision';
import { Guid } from 'guid-typescript';
import { IProfile } from '../../store/profile';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    openedCollision?: Guid;
    editing?: boolean;
    collisions: IAttendee[];
    profile: IProfile | null;
}

const AttendeeCollisionList: React.FC<IProps> = ({
    classes,
    openedCollision,
    editing,
    collisions,
    profile,
}) => {
    return <>
            {profile !== null ?
                <AttendeeCollision 
                    openEditing={editing}
                    key={profile.id.toString()} 
                    toDisplay={profile} 
                    expandedDefault={openedCollision !== undefined ? openedCollision.toString() === profile.id.toString() : false} /> : ''}
            {collisions.sort((a, b) => a.lastName < b.lastName ? 1 : -1).map(c =>
                <AttendeeCollision
                    key={c.id.toString()}
                    toDisplay={c}
                    expandedDefault={openedCollision !== undefined ? openedCollision.toString() === c.id.toString() : false} />)}
        </>;
}

const mapStateToProps = (store: IAppState) => {
    return {
        collisions: store.attendeesState.collisions,
        profile: store.profile.userProfile,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttendeeCollisionList));