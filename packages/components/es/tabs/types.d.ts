import type { ExtractPropTypes, PropType } from 'vue';
import type { AheartSize } from '../config';
export interface TabItem {
    key: string;
    label: string;
    children?: string;
    disabled?: boolean;
}
export type TabsType = 'line' | 'card';
export declare const tabsProps: {
    readonly items: PropType<TabItem[]>;
    readonly activeKey: StringConstructor;
    readonly defaultActiveKey: StringConstructor;
    readonly type: {
        readonly type: PropType<TabsType>;
        readonly default: "line";
    };
    readonly size: PropType<AheartSize>;
    readonly centered: BooleanConstructor;
};
export declare const tabsEmits: {
    'update:activeKey': (key: string) => boolean;
    change: (key: string) => boolean;
};
export type TabsProps = ExtractPropTypes<typeof tabsProps>;
