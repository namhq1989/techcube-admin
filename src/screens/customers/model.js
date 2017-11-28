import { RcNotification } from '../../components'
import { AppConst } from '../../configs'
import { recent } from './service'

export default {
  namespace: 'customers',
  state: {
    isLoaded: false,
    data: [],
    filter: {
      total: 0,
      page: 0,
      limit: 20,
      keyword: ''
    }
  },

  effects: {
    * recent({ payload }, { call, put }) {
      const data = yield call(recent, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          data: response.data.customers,
          filter: {
            total: response.data.total,
            limit: response.data.limitPerPage,
            ...payload
          },
          isLoaded: true
        }
      })
    }
  },

  reducers: {
    updateState(state, action) {
      let filter = state.filter
      if (action.payload.filter) {
        filter = Object.assign(filter, action.payload.filter)
      }
      action.payload.filter = filter
      return {
        ...state,
        ...action.payload
      }
    }
  }
}
