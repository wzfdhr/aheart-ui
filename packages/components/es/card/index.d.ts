import card from './card.vue';
import cardGrid from './grid.vue';
import cardMeta from './meta.vue';
import { type SFCWithInstall } from '../utils/install';
export declare const CardMeta: SFCWithInstall<typeof cardMeta>;
export declare const CardGrid: SFCWithInstall<typeof cardGrid>;
type CardComponent = SFCWithInstall<typeof card> & {
    Meta: typeof CardMeta;
    Grid: typeof CardGrid;
};
declare const Card: CardComponent;
export { CardGrid as ACardGrid, CardMeta as ACardMeta };
export type { CardAction, CardClassNames, CardGridClassNames, CardGridProps, CardGridSemanticPart, CardGridStyles, CardMetaClassNames, CardMetaProps, CardMetaSemanticPart, CardMetaStyles, CardProps, CardSemanticPart, CardStyles, CardTab, CardTabClassNames, CardTabProps, CardTabSemanticPart, CardTabStyles, CardType, CardVariant } from './types';
export default Card;
