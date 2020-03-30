import React from 'react';
import { TextFieldProps, TextField } from '@material-ui/core';
import ReactResizeDetector from 'react-resize-detector';

const HiddableTextareaComp: React.FC<TextFieldProps> = ({
    ...textFieldProps
}) => {
    const onResize = () => {
        window.dispatchEvent(new Event('resize'));
    };

    return <ReactResizeDetector handleWidth onResize={onResize}>
        <TextField {...textFieldProps} />
    </ReactResizeDetector>;
}

export default HiddableTextareaComp;