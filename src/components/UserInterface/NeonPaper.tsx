import React from 'react';
import { WithStyles, createStyles, withStyles, Theme, PaperProps, Paper, TypographyProps, Typography, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FabWithHidden from './FabWithHidden';
import { headerHeight } from '../../route';
import { IAppState } from '../../store';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const lightNeonPaperTextClassName: string = 'light-neon-text';
const darkNeonPaperTextClassName: string = 'dark-neon-text';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        margin: 8,
        '&.hasExpander': {
            overflow: 'hidden',
        },
        '&.expanded': {
            overflowY: 'auto',
            '&::-webkit-scrollbar-track': {
                borderRadius: '10px',
                backgroundColor: theme.palette.primary,
            },
            '&::-webkit-scrollbar': {
                width: '12px',
                backgroundColor: theme.palette.primary,
                border: `1px solid ${theme.palette.primary.contrastText}`,
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                backgroundColor: theme.palette.primary.contrastText,
            },
        },
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
    buttons: {
        float: 'right',
        '& > .MuiFab-root': {
            marginLeft: theme.spacing(0.5),
        },
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
        borderColor: 'rgb(230, 116, 0)',
        '& .MuiFab-root': {
            color: 'rgb(230, 116, 0)',
        },
        '& .light-neon-text': {
            color: 'rgb(230, 116, 0)',
        },
        '& .dark-neon-text': {
            color: 'rgb(115, 58, 0)',
        },
    },
    yellow: {
        borderColor: 'rgb(242, 255, 0)',
        '& .MuiFab-root': {
            color: 'rgb(242, 255, 0)',
        },
        '& .light-neon-text': {
            color: 'rgb(242, 255, 0)',
        },
        '& .dark-neon-text': {
            color: 'rgb(121, 125, 0)',
        },
    },
});

interface IProps extends WithStyles<typeof styles> {
    color: ('green' | 'orange' | 'yellow');
    density: ('normal' | 'dense');
    headerButtons?: JSX.Element[];
    hasExpander?: boolean;
    expanded?: boolean;
    onExpandContractClick?: () => void;
}

const NeonPaper: React.FC<IProps & PaperProps> = ({
    classes,
    children,
    className,
    style,
    color,
    density,
    headerButtons,
    hasExpander,
    expanded,
    onExpandContractClick,
    ...rest
}) => {
    const margin: string = '5px';
    const expandedStyle: React.CSSProperties = {
        top: `${headerHeight}`,
        left: '0px',
        position: 'fixed',
        zIndex: 1200,
        height: `calc(100vh - ${headerHeight} - 112px - (2 * ${margin}))`,
        width: `calc(100% - (2 * ${margin}))`,
        margin: margin,
    };
    
    const [expandedLocal, setExpandedLocal] = React.useState(false);

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
            case "yellow":
                return classes.yellow;
            }
    }

    const expand = () => {
        if (onExpandContractClick !== undefined) {
            onExpandContractClick();
        }
        else {
            setExpandedLocal(true);
        }
    }

    const contract = () => {
        if (onExpandContractClick !== undefined) {
            onExpandContractClick();
        }
        else {
            setExpandedLocal(false);
        }
    }

    const expandedFinal: boolean = expanded !== undefined ? expanded : expandedLocal;

    return (
        <Paper
            variant="outlined"
            className={`${className} ${classes.root} ${hasExpander ? 'hasExpander' : ''} ${expandedFinal ? 'expanded' : ''} ${getDensityClass()} ${getColorClass()}`} 
            style={expandedFinal ? expandedStyle : {}}
            {...rest}>
                <Box className={classes.buttons}>
                    {headerButtons !== undefined ? headerButtons : ''}
                    <FabWithHidden size="small" onClick={() => expand()} hidden={!hasExpander || expandedFinal}>
                        <ExpandMoreIcon fontSize="small" />
                    </FabWithHidden>
                    <FabWithHidden size="small" onClick={() => contract()} hidden={!hasExpander || !expandedFinal}>
                        <ExpandLessIcon fontSize="small" />
                    </FabWithHidden>
                </Box>
                {children}
        </Paper>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        location: store.router.location.hash,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({});

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
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