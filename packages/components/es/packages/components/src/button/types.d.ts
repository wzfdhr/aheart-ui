import { ExtractPropTypes } from 'vue';
export declare const ButtonType: string[];
export declare const ButtonSize: string[];
export declare const buttonProps: {
    type: {
        type: StringConstructor;
        values: string[];
    };
    size: {
        type: StringConstructor;
        values: string[];
    };
};
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
