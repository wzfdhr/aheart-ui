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
    readonly orientation: import("vue").PropType<import("./types").StepsDirection>;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly type: {
        readonly type: import("vue").PropType<import("./types").StepsType>;
        readonly default: "default";
    };
    readonly titlePlacement: {
        readonly type: import("vue").PropType<import("./types").StepsTitlePlacement>;
        readonly default: "horizontal";
    };
    readonly initial: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly percent: NumberConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").StepsSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").StepsSemanticPart, import("vue").StyleValue>>>;
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
    readonly orientation: import("vue").PropType<import("./types").StepsDirection>;
    readonly size: import("vue").PropType<import("../config").AheartSize>;
    readonly type: {
        readonly type: import("vue").PropType<import("./types").StepsType>;
        readonly default: "default";
    };
    readonly titlePlacement: {
        readonly type: import("vue").PropType<import("./types").StepsTitlePlacement>;
        readonly default: "horizontal";
    };
    readonly initial: {
        readonly type: NumberConstructor;
        readonly default: 1;
    };
    readonly percent: NumberConstructor;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: import("vue").PropType<import("vue").StyleValue>;
    readonly classNames: import("vue").PropType<Partial<Record<import("./types").StepsSemanticPart, string>>>;
    readonly styles: import("vue").PropType<Partial<Record<import("./types").StepsSemanticPart, import("vue").StyleValue>>>;
}>> & Readonly<{
    onChange?: ((current: number) => any) | undefined;
}>, {
    readonly type: import("./types").StepsType;
    readonly initial: number;
    readonly status: StepStatus;
    readonly direction: import("./types").StepsDirection;
    readonly titlePlacement: import("./types").StepsTitlePlacement;
    readonly current: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
