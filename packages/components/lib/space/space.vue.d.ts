import { type PropType, type VNodeChild } from 'vue';
import { type SpaceSize } from './types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    readonly size: PropType<SpaceSize>;
    readonly direction: {
        readonly type: PropType<import("./types").SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly orientation: PropType<import("./types").SpaceDirection>;
    readonly vertical: BooleanConstructor;
    readonly align: PropType<import("./types").SpaceAlign>;
    readonly wrap: BooleanConstructor;
    readonly separator: PropType<VNodeChild>;
    readonly split: PropType<VNodeChild>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<import("./types").SpaceClassNames>;
    readonly styles: PropType<import("./types").SpaceStyles>;
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    readonly size: PropType<SpaceSize>;
    readonly direction: {
        readonly type: PropType<import("./types").SpaceDirection>;
        readonly default: "horizontal";
    };
    readonly orientation: PropType<import("./types").SpaceDirection>;
    readonly vertical: BooleanConstructor;
    readonly align: PropType<import("./types").SpaceAlign>;
    readonly wrap: BooleanConstructor;
    readonly separator: PropType<VNodeChild>;
    readonly split: PropType<VNodeChild>;
    readonly className: StringConstructor;
    readonly rootClassName: StringConstructor;
    readonly style: PropType<import("vue").StyleValue>;
    readonly classNames: PropType<import("./types").SpaceClassNames>;
    readonly styles: PropType<import("./types").SpaceStyles>;
}>> & Readonly<{}>, {
    readonly wrap: boolean;
    readonly vertical: boolean;
    readonly direction: import("./types").SpaceDirection;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
