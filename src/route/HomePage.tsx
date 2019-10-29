import React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ThunkDispatch } from 'redux-thunk';
import { push } from 'connected-react-router';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

interface IProps extends WithStyles<typeof styles> {
    push: (url: string) => void;
}

const HomePage: React.FC<IProps> = ({
    classes,
    push,
}) => {
    return (
        <div className={classes.root}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla.</p>
            <div>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => push('/people')}>
                        Go to People
                </Button>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis nulla vel sem mollis sodales. Etiam ut eros iaculis, placerat massa et, hendrerit libero. Maecenas sed luctus nisi. Nunc malesuada rutrum enim sit amet maximus. Quisque vehicula augue nec luctus finibus. In et facilisis libero. Sed gravida feugiat metus non fermentum. Nam viverra purus eget feugiat egestas. Proin ligula metus, finibus in purus id, commodo pretium nulla.</p>
        </div>
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        push: (url: string) => dispatch(push(url)),
    };
};

export default withStyles(styles)(connect(
    undefined,
    mapDispatchToProps,
)(HomePage));