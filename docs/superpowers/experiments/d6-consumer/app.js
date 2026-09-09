import { defineComponent, h, ref } from 'vue'
import { ConfigProvider, DatePicker, TimeRangePicker, Upload, enUS } from 'aheart-ui'

export const makeConsumerApp = () => defineComponent({
  name: 'D6ConsumerApp',
  setup() {
    const files = ref([])
    const customRequest = ({ onSuccess }) => onSuccess({ ok: true })
    return () => h(ConfigProvider, { locale: enUS }, {
      default: () => h('main', { 'data-d6-consumer': '' }, [
        h(DatePicker, { modelValue: '2026-07-14 09:30:00', showTime: true, needConfirm: true }),
        h(TimeRangePicker, { modelValue: ['09:00:00', '18:00:00'], needConfirm: true, changeOnScroll: true }),
        h(Upload, {
          fileList: files.value,
          'onUpdate:fileList': value => { files.value = value },
          beforeUpload: () => false,
          customRequest,
          timeout: 500
        })
      ])
    })
  }
})
