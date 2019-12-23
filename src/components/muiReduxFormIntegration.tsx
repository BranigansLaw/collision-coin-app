import React from 'react';
import { TextField } from "@material-ui/core";

export const renderTextField = (
    { input, label, meta: { touched, error }, ...custom }: {
        [x: string]: any;
        input: any;
        label: string;
        meta: {
            touched: any;
            error: any;
        };
    },
) => (
    <TextField
        label={label}
        {...input}
        {...custom}
    />
);