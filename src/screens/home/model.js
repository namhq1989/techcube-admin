import { RcNotification } from '../../components'
import { AppConst, MessageConst } from '../../configs'
import { helper } from '../../utils'
import { recentBills, search, createBill, checkCode, useCode } from './service'

export default {
  namespace: 'home',
  state: {
    isLoaded: false,
    data: [],
    filter: {
      total: 0,
      page: 0,
      limit: 20
    },
    customer: {
      phone: ''
    },
    promotionCode: null,
    visibleModalBill: false,
    visibleModalCode: false
  },

  subscriptions: {},

  effects: {
    * recentBills({ payload }, { call, put }) {
      const data = yield call(recentBills, payload)

      if (!data || data.err) {
        return RcNotification(MessageConst.ServerError, AppConst.notification.error)
      }

      const response = data.data
      if (!response || !response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          data: response.data.bills,
          filter: {
            limit: response.data.limitPerPage,
            total: response.data.total,
            ...payload
          },
          isLoaded: true
        }
      })
    },

    * search({ payload }, { call, put }) {
      if (!payload.keyword || payload.keyword.length < 6) {
        return RcNotification(MessageConst.Common.CustomerNotFound, AppConst.notification.error)
      }
      payload.keyword = payload.keyword.split(' ').join('')

      const data = yield call(search, payload)

      if (!data || data.err) {
        return RcNotification(MessageConst.ServerError, AppConst.notification.error)
      }

      const response = data.data
      if (!response || !response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      if (!response.data.user && !helper.isPhoneNumber(payload.keyword)) {
        return RcNotification(MessageConst.Common.CustomerNotFound, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          customer: response.data.user || {
            phone: payload.keyword
          },
          visibleModalBill: true
        }
      })
    },

    * closeModalBill(data, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          customer: {
            phone: ''
          },
          visibleModalBill: false
        }
      })
    },

    * createBill({ payload }, { call, put }) {
      const data = yield call(createBill, payload)

      if (!data || data.err) {
        return RcNotification(MessageConst.ServerError, AppConst.notification.error)
      }

      const response = data.data
      if (!response || !response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      RcNotification(MessageConst.Common.CreateBillSuccess)
      yield put({
        type: 'updateState',
        payload: {
          visibleModalBill: false
        }
      })
      yield put({
        type: 'recentBills',
        payload: {
          page: 0
        }
      })
    },

    * checkCode({ payload }, { call, put }) {
      const data = yield call(checkCode, payload)

      if (!data || data.err) {
        return RcNotification(MessageConst.ServerError, AppConst.notification.error)
      }

      const response = data.data
      if (!response || !response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          visibleModalCode: true,
          promotionCode: response.data
        }
      })
    },

    * useCode({ payload }, { call, put }) {
      const data = yield call(useCode, payload)

      if (!data || data.err) {
        return RcNotification(MessageConst.ServerError, AppConst.notification.error)
      }

      const response = data.data
      if (!response || !response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      RcNotification(MessageConst.Common.UsePromotionCodeSuccess)

      yield put({
        type: 'closeModalCode'
      })
    },

    * closeModalCode(data, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          visibleModalCode: false,
          promotionCode: null
        }
      })
    },
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
