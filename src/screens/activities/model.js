import { RcNotification } from '../../components'
import { AppConst } from '../../configs'
import { recent } from './service'

export default {
  namespace: 'activities',
  state: {
    data: [],
    filter: {
      total: 0,
      page: 0,
      limit: 20,
      start: AppConst.components.rangePicker.start,
      end: AppConst.components.rangePicker.end,
      sort: '-date'
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
          data: response.data.checkin,
          filter: {
            total: response.data.total,
            limit: response.data.limitPerPage,
            ...payload
          }
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
