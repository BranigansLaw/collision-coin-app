import React from 'react';
import { AnyAction } from 'redux';
import RehydrateWrapper from './components/Wrappers/RehydrateWrapper';
import Route from './route';
import { ThunkDispatch } from 'redux-thunk';
import OfflineWrapper from './components/Wrappers/OfflineWrapper';
import ServiceWorkerUpdateWrapper from './components/Wrappers/ServiceWorkerUpdateWrapper';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { lightTheme, darkTheme } from './theme';
import { CssBaseline } from '@material-ui/core';
import { IAppState } from './store';
import { connect } from 'react-redux';
import LocalDataIntegrityCheck from './components/Wrappers/LocalDataIntegrityCheck';

interface IProps {
    isLightMode: boolean;
}

const ThemeWrapper: React.FC<IProps> = ({
    isLightMode,
}) => {
    return (
        <MuiThemeProvider theme={isLightMode ? lightTheme : darkTheme }>
            <CssBaseline />
            <RehydrateWrapper>
                <OfflineWrapper>
                    <ServiceWorkerUpdateWrapper>
                        <LocalDataIntegrityCheck>
                            <Route />
                        </LocalDataIntegrityCheck>
                    </ServiceWorkerUpdateWrapper>
                </OfflineWrapper>
            </RehydrateWrapper>
        </MuiThemeProvider>
    );
}

const mapStateToProps = (store: IAppState) => {
    return {
        isLightMode: store.profile.userProfile !== null ? store.profile.userProfile.isLightMode : true,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThemeWrapper);
