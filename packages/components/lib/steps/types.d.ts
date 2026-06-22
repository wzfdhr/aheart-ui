import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { AheartSize } from '../config';
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepsDirection = 'horizontal' | 'vertical';
export type StepsType = 'default' | 'dot' | 'navigation' | 'panel' | 'inline';
export type StepsTitlePlacement = 'horizontal' | 'vertical';
export type StepsSemanticPart = 'root' | 'item' | 'activeItem' | 'button' | 'indicator' | 'icon' | 'content' | 'title' | 'subTitle' | 'description' | 'connector';
export type StepsClassNames = Partial<Record<StepsSemanticPart, string>>;
export type StepsStyles = Partial<Record<StepsSemanticPart, StyleValue>>;
export interface StepItem {
    title: string;
    description?: string;
    status?: StepStatus;
    disabled?: boolean;
    icon?: string;
    subTitle?: string;
    content?: string;
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
    readonly orientation: PropType<StepsDirection>;
    readonly size: PropType<AheartSize>;
    readonly type: {
        readonly type: PropType<StepsType>;
        readonly default: "default";
    };
    readonly titlePlacement: {
        readonly type: PropType<StepsTitlePlacement>;
        readonly default: "horizontal";
    };
    readonly initial: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly percent: NumberConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<StyleValue>;
    readonly classNames: PropType<Partial<Record<StepsSemanticPart, string>>>;
    readonly styles: PropType<Partial<Record<StepsSemanticPart, StyleValue>>>;
};
export declare const stepsEmits: {
    change: (current: number) => boolean;
};
export type StepsProps = ExtractPropTypes<typeof stepsProps>;
