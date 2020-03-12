import React from 'react';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { ButtonProps, Button, WithStyles, createStyles, withStyles, Fade, CircularProgress } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    root: {
    },
    spinner: {
        marginLeft: theme.spacing(0.5),
        color: 'inherit',
    },
});

interface LoadingButtonProps extends WithStyles<typeof styles> {
    loading: boolean;
}

class LoadingButton extends React.Component<ButtonProps & LoadingButtonProps> {
    render(){
        const {
            classes,
            className,
            children,
            loading,
            disabled,
            ...buttonProps
        } = this.props;
    
        return (
            <Button className={`${className !== undefined ? className : ''} ${classes.root}`} disabled={disabled || loading} {...buttonProps}>
                {children}
                <Fade
                    in={loading}
                    unmountOnExit>
                    <CircularProgress size={30} className={classes.spinner} />
                </Fade>
            </Button>);
    }
}

export default withStyles(styles)(LoadingButton);