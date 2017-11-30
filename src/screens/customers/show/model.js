import { RcNotification } from '../../../components'
import { AppConst, MessageConst } from '../../../configs'
import { load, checkin, resend } from './service'

export default {
  namespace: 'customerShow',
  state: {
    data: null,
    checkin: [],
    filter: {
      total: 0,
      page: 0,
      limit: 20,
      sort: '-date'
    }
  },

  effects: {
    * load({ payload }, { call, put }) {
      const data = yield call(load, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          data: response.data.customer
        }
      })
    },

    * checkin({ payload }, { call, put }) {
      const data = yield call(checkin, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          checkin: response.data.checkin,
          filter: {
            total: response.data.total,
            limit: response.data.limitPerPage,
            ...payload
          }
        }
      })
    },

    * resend({ customerId }, { call }) {
      const data = yield call(resend, customerId)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      RcNotification(MessageConst.Customer.ResendSuccess)
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
