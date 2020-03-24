import React from 'react';
import ResizableCode from './ResizableCode';

interface IProps {
    qrCode: string | undefined;
}

const CodeDisplay: React.FC<IProps> = ({
    qrCode,
}) => {
    return (
        <>
            {qrCode === undefined ? <></> : <ResizableCode qrCode={qrCode} />}
        </>
    );
}

export default CodeDisplay;