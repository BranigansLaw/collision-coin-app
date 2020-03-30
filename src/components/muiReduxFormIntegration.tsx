import React from 'react';
import { TextField, FormHelperText, Select, InputLabel, FormControl } from "@material-ui/core";
import HideableTextArea from './UserInterface/HideableTextArea';

interface IMeta {
    touched: boolean;
    error: any;
    warning: any;
}

export const renderTextField = (
    { input, label, type, meta: { touched, error, warning }, ...custom }: {
        [x: string]: any;
        input: any;
        label: string;
        type: string;
        meta: IMeta;
    },
) => (
    <TextField
        type={type}
        error={touched && (error !== undefined || warning !== undefined)}
        helperText={error ? error : warning}
        label={label}
        {...input}
        {...custom}
    />
);

export const renderHideableMultilineTextField = (
    { input, label, type, meta: { touched, error, warning }, ...custom }: {
        [x: string]: any;
        input: any;
        label: string;
        type: string;
        meta: IMeta;
    },
) => (
    <HideableTextArea
        type={type}
        error={touched && (error !== undefined || warning !== undefined)}
        helperText={error ? error : warning}
        label={label}
        {...input}
        {...custom}
    />
);

export interface IInputProps {
    name: string;
    id: string;
}
export const renderSelectField = ({
    input,
    label,
    inputProps,
    meta: { touched, error },
    children,
    ...custom
}: {
    input: any;
    label: string;
    inputProps: IInputProps;
    meta: IMeta;
    children: any;
}) => (
    <FormControl error={touched && error}>
        <InputLabel htmlFor="age-native-simple">{label}</InputLabel>
        <Select
            native
            {...input}
            {...custom}
            inputProps={inputProps}
        >
            {children}
        </Select>
        {renderFromHelper({ touched, error })}
    </FormControl>
)

const renderFromHelper = ({ touched, error }: {
    touched: any,
    error: any,
}) => {
    if (!(touched && error)) {
        return
    } else {
        return <FormHelperText>{touched && error}</FormHelperText>
    }
}