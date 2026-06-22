import { type StepItem, type StepStatus } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<StepItem[]>;
    readonly current: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly status: {
        readonly type: import("vue").PropType<StepStatus>;
        readonly default: "process";
    };
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").StepsDirection>;
        readonly default: "horizontal";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (current: number) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly items: import("vue").PropType<StepItem[]>;
    readonly current: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly status: {
        readonly type: import("vue").PropType<StepStatus>;
        readonly default: "process";
    };
    readonly direction: {
        readonly type: import("vue").PropType<import("./types").StepsDirection>;
        readonly default: "horizontal";
    };
    readonly size: import("vue").PropType<import("../config").AheartSize>;
}>> & Readonly<{
    onChange?: ((current: number) => any) | undefined;
}>, {
    readonly status: StepStatus;
    readonly current: number;
    readonly direction: import("./types").StepsDirection;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
