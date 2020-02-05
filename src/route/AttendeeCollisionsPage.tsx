import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import AttendeeCollisionList from '../components/AttendeeCollisions/AttendeeCollisionList';
import { Guid } from 'guid-typescript';

const styles = (theme: Theme) => createStyles({
});

interface IProps extends WithStyles<typeof styles> {
    openedCollisionId?: string;
    editing?: boolean;
}

const AttendeeCollisionsPage: React.FC<IProps> = ({
    openedCollisionId,
    editing,
    classes,
}) => {
    let openedCollsionParsed: Guid | undefined = undefined;
    if (openedCollisionId !== undefined && Guid.isGuid(openedCollisionId)) {
        openedCollsionParsed = Guid.parse(openedCollisionId);
    }

    return (
        <AttendeeCollisionList openedCollision={openedCollsionParsed} editing={editing} />
    );
}

export default withStyles(styles)(AttendeeCollisionsPage);