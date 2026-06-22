import typography from './typography.vue'
import title from './title.vue'
import text from './text.vue'
import paragraph from './paragraph.vue'
import link from './link.vue'
import { withInstall } from '../utils/install'

const Typography = withInstall(typography, 'ATypography')
const Title = withInstall(title, 'ATitle')
const Text = withInstall(text, 'AText')
const Paragraph = withInstall(paragraph, 'AParagraph')
const Link = withInstall(link, 'ALink')

export { Title, Text, Paragraph, Link }
export default Typography
