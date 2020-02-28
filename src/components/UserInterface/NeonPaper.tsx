import React from 'react';
import { WithStyles, createStyles, withStyles, Theme, PaperProps, Paper, TypographyProps, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FabWithHidden from './FabWithHidden';
import { headerHeight } from '../../route';
import { IAppState } from '../../store';
import { connect } from 'react-redux';

const lightNeonPaperTextClassName: string = 'light-neon-text';
const darkNeonPaperTextClassName: string = 'dark-neon-text';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        margin: 8,
    },
    normalDensity: {
        padding: theme.spacing(2),
    },
    denseDensity: {
        paddingTop: theme.spacing(0.75),
        paddingBottom: theme.spacing(0.75),
        paddingLeft: theme.spacing(1.25),
        paddingRight: theme.spacing(1.25),
    },
    expandButton: {
        float: 'right',
    },
    green: {
        borderColor: 'rgb(0, 255, 0)',
        '& .MuiFab-root': {
            color: 'rgb(0, 255, 0)',
        },
        '& .light-neon-text': {
            color: 'rgb(0, 255, 0)',
        },
        '& .dark-neon-text': {
            color: 'rgb(0, 150, 0)',
        },
    },
    orange: {
        borderColor: 'rgb(155, 155, 0)',
        '& .light-neon-text': {
            color: 'rgb(155, 155, 0)',
        },
        '& .dark-neon-text': {
            color: 'rgb(75, 75, 0)',
        },
    },
});

interface IProps extends WithStyles<typeof styles> {
    color: ('green' | 'orange');
    density: ('normal' | 'dense');
    hasExpander?: boolean;
    location: string;
}

const NeonPaper: React.FC<IProps & PaperProps> = ({
    classes,
    children,
    className,
    style,
    color,
    density,
    hasExpander,
    location,
    ...rest
}) => {
    const margin: string = '5px';
    const expandedStyle: React.CSSProperties = {
        top: `${headerHeight}`,
        left: '0px',
        position: 'fixed',
        zIndex: 1500,
        height: `calc(100vh - ${headerHeight} - 112px - (2 * ${margin}))`,
        width: `calc(100% - (2 * ${margin}))`,
        margin: margin,
    };
    
    const [expanded, setExpanded] = React.useState(false);

    const getDensityClass = () => {
        switch (density) {
            case "dense":
                return classes.denseDensity;
            case "normal":
                return classes.normalDensity;
        }
    }

    const getColorClass = () => {
        switch (color) {
            case "green":
                return classes.green;
            case "orange":
                return classes.orange;
        }
    }

    const expand = () => {
        setExpanded(true);
    }

    const contract = () => {
        setExpanded(false);
    }

    return (
        <Paper
            variant="outlined"
            className={`${className} ${classes.root} ${getDensityClass()} ${getColorClass()}`} 
            style={expanded ? expandedStyle : {}}
            {...rest}>
                <FabWithHidden className={classes.expandButton} size="small" onClick={() => expand()} hidden={!hasExpander || expanded}>
                    <ExpandMoreIcon fontSize="small" />
                </FabWithHidden>
                <FabWithHidden className={classes.expandButton} size="small" onClick={() => contract()} hidden={!hasExpander || !expanded}>
                    <ExpandLessIcon fontSize="small" />
                </FabWithHidden>
                {children}
        </Paper>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        location: store.router.location.hash,
    };
};

export default withStyles(styles)(connect(
    mapStateToProps,
    undefined,
)(NeonPaper));

interface INeonPaperTypographyProps {
    shade: ('light' | 'dark');
}

export const NeonPaperTypography: React.FC<INeonPaperTypographyProps & TypographyProps> = ({
    className,
    shade,
    children,
    ...rest
}) => {
    return (
        <Typography className={`${className} ${shade === 'light' ? lightNeonPaperTextClassName : darkNeonPaperTextClassName}`} {...rest}>
            {children}
        </Typography>
    );
}