import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { IAppState } from '../../store';
import { IAttendee, ApprovalState } from '../../store/attendee';
import AttendeeCollision from './AttendeeCollision';
import { Guid } from 'guid-typescript';
import { ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

export const CollisionCoinId: string = Guid.EMPTY.toString();

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    openedCollision?: Guid;
    collisions: IAttendee[];
    state: ApprovalState;
}

const PendingCollisionsCollapsible: React.FC<IProps> = ({
    classes,
    openedCollision,
    collisions,
    state,
}) => {
    const sortedPendingCollisions = React.useMemo(() => 
        collisions.filter(c => c.approvalState === state).sort((a, b) => a.lastName < b.lastName ? 1 : -1),
    [collisions, state]);

    const stateString = React.useMemo(() => state === 'New' ? 'Pending' : 'Blocked', [state]);

    const [pendingApprovalOpen, setPendingApprovalOpen] = React.useState<boolean>(false);

    return <>
            {sortedPendingCollisions.length > 0 ?
                <>
                    <ListItem button onClick={() => setPendingApprovalOpen(!pendingApprovalOpen)}>
                        <ListItemText primary={`${stateString} Collisions (${sortedPendingCollisions.length})`} />
                        {pendingApprovalOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={pendingApprovalOpen} timeout="auto" unmountOnExit>
                        {sortedPendingCollisions.map(c =>
                            <AttendeeCollision
                                key={c.id.toString()}
                                toDisplay={c}
                                expandedDefault={openedCollision !== undefined ? openedCollision.toString() === c.id.toString() : false} />)}
                    </Collapse>
                </> : <></>}
        </>;
}

const mapStateToProps = (store: IAppState) => {
    return {
        collisions: store.attendeesState.collisions,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(PendingCollisionsCollapsible));