import { h } from 'vue'
import { DatePicker, TimeRangePicker, Upload } from 'aheart-ui'
import type { RangePickerValue, UploadFile, UploadRequest, UploadRequestOption } from 'aheart-ui'

const range: RangePickerValue = ['09:00:00', '18:00:00']
const cancelled: UploadFile = {
  uid: 'cancelled',
  name: 'cancelled.txt',
  status: 'cancelled',
  failureReason: 'cancelled'
}
const request: UploadRequest = ({ signal, taskId, onProgress, onSuccess, onError, onCancel }: UploadRequestOption) => {
  void signal
  void taskId
  void onProgress
  void onSuccess
  void onError
  void onCancel
  return { abort: () => undefined }
}

h(DatePicker, { modelValue: '2026-07-14', needConfirm: true })
h(TimeRangePicker, { modelValue: range, needConfirm: true, changeOnScroll: true })
h(Upload, { fileList: [cancelled], timeout: 500, customRequest: request })
