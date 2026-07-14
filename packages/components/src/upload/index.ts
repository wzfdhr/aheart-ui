import Upload from './upload.vue'
import { withInstall } from '../utils/install'

export type { UploadFile, UploadRequest, UploadRequestOption, UploadStatus } from './types'
export default withInstall(Upload, 'AUpload')
