import { routerRedux } from 'dva/router'
import { RcNotification } from '../../components'
import { AppConst, MessageConst } from '../../configs'
import { load, recent, importExcel, create, update } from './service'

export default {
  namespace: 'customers',
  state: {
    data: [],
    customer: null,
    importFailed: [],
    isCreateSuccess: false,
    filter: {
      total: 0,
      page: 0,
      limit: 20,
      keyword: ''
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
          customer: response.data.customer
        }
      })
    },

    * update({ payload, customerId }, { call, put }) {
      const data = yield call(update, customerId, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      return yield put(routerRedux.push(`/customers/${customerId}`))
    },

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
          importFailed: [],
          isCreateSuccess: false,
          filter: {
            total: response.data.total,
            limit: response.data.limitPerPage,
            ...payload
          }
        }
      })
    },

    * importExcel({ payload }, { call, put }) {
      const data = yield call(importExcel, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          importFailed: response.data.failed
        }
      })

      yield put({
        type: 'recent',
        payload: {
          page: 0
        }
      })
    },

    * create({ payload }, { call, put }) {
      const data = yield call(create, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      RcNotification(MessageConst.Customer.CreateSuccess)

      if (!payload.keepCreate) {
        return yield put(routerRedux.push('/customers'))
      }

      yield put({
        type: 'updateState',
        payload: {
          isCreateSuccess: true
        }
      })
    },

    * editUnmount(data, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          customer: null,
          isCreateSuccess: false
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
