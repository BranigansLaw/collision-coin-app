import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store';

interface IProps {
    rehydrated: boolean;
    children: React.ReactNode;
}

const RehydrateWrapper: React.FC<IProps> = ({
    rehydrated,
    children,
}) => {
    if (rehydrated) {
        return (
            <>{children}</>
        );
    }
    else {
        return (<div>Loading</div>);
    }
}

const mapStateToProps = (store: IAppState) => {
    return {
        rehydrated: store.rehydrated.rehydrated,
    };
};

export default connect(
    mapStateToProps,
    undefined,
)(RehydrateWrapper);