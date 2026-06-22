import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepsDirection = 'horizontal' | 'vertical';
export interface StepItem {
    title: string;
    description?: string;
    status?: StepStatus;
    disabled?: boolean;
}
export declare const stepsProps: {
    readonly items: PropType<StepItem[]>;
    readonly current: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly status: {
        readonly type: PropType<StepStatus>;
        readonly default: "process";
    };
    readonly direction: {
        readonly type: PropType<StepsDirection>;
        readonly default: "horizontal";
    };
    readonly size: PropType<AheartSize>;
};
export declare const stepsEmits: {
    change: (current: number) => boolean;
};
export type StepsProps = ExtractPropTypes<typeof stepsProps>;
