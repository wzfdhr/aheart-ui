import card from './card.vue'
import cardGrid from './grid.vue'
import cardMeta from './meta.vue'
import { withInstall, type SFCWithInstall } from '../utils/install'

export const CardMeta = withInstall(cardMeta, 'ACardMeta')
export const CardGrid = withInstall(cardGrid, 'ACardGrid')

type CardComponent = SFCWithInstall<typeof card> & {
  Meta: typeof CardMeta
  Grid: typeof CardGrid
}

const Card = withInstall(card, 'ACard') as CardComponent
Card.Meta = CardMeta
Card.Grid = CardGrid

export { CardGrid as ACardGrid, CardMeta as ACardMeta }
export type {
  CardAction,
  CardClassNames,
  CardGridClassNames,
  CardGridProps,
  CardGridSemanticPart,
  CardGridStyles,
  CardMetaClassNames,
  CardMetaProps,
  CardMetaSemanticPart,
  CardMetaStyles,
  CardProps,
  CardSemanticPart,
  CardStyles,
  CardTab,
  CardTabClassNames,
  CardTabProps,
  CardTabSemanticPart,
  CardTabStyles,
  CardType,
  CardVariant
} from './types'
export default Card
