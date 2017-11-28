import { message } from 'antd'
import { AppConst } from '../configs'

export default function (text, type) {
  const duration = (type === AppConst.notification.error) ? 3 : 6
  message[type || AppConst.notification.success](text, duration)
}
