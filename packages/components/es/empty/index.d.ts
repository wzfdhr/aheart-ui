import empty from './empty.vue';
import { type SFCWithInstall } from '../utils/install';
export declare const PRESENTED_IMAGE_DEFAULT: "__AHEART_EMPTY_PRESENTED_IMAGE_DEFAULT__";
export declare const PRESENTED_IMAGE_SIMPLE: "__AHEART_EMPTY_PRESENTED_IMAGE_SIMPLE__";
export type EmptyComponent = SFCWithInstall<typeof empty> & {
    PRESENTED_IMAGE_DEFAULT: typeof PRESENTED_IMAGE_DEFAULT;
    PRESENTED_IMAGE_SIMPLE: typeof PRESENTED_IMAGE_SIMPLE;
};
declare const Empty: EmptyComponent;
export default Empty;
