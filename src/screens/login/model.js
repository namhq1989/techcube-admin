import { RcNotification } from '../../components'
import { AppConst, MessageConst } from '../../configs'
import { login } from './service'

export default {
  namespace: 'login',
  state: {},

  effects: {
    * login({ payload }, { call, put }) {
      const data = yield call(login, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      const user = response.data.user
      const isAdmin = user.role === AppConst.roles.admin

      // Check roles
      if (!isAdmin) {
        return RcNotification(MessageConst.NoPermission, AppConst.notification.error)
      }

      localStorage.setItem(AppConst.localStorage.authKey, response.data.token)
      // Setup some stuffs for app
      yield put({ type: 'app/init' })
    }
  }
}
