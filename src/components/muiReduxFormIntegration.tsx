import React from 'react';
import { TextField } from "@material-ui/core";

export const renderTextField = (
    { input, label, type, meta: { touched, error, warning }, ...custom }: {
        [x: string]: any;
        input: any;
        label: string;
        type: string;
        meta: {
            touched: any;
            error: any;
            warning: any;
        };
    },
) => (
    <>
        <TextField
            label={label}
            {...input}
            {...custom}
        />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </>
);