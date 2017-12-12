import { routerRedux } from 'dva/router'
import lodash from 'lodash'
import { RcNotification } from '../../components'
import { AppConst, MessageConst } from '../../configs'
import { recent, create, update, load, changeStatus } from './service'

export default {
  namespace: 'staffs',
  state: {
    data: [],
    staff: null,
    filter: {
      total: 0,
      page: 0,
      limit: 20,
      keyword: '',
      sort: '-createdAt'
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
          staff: response.data.user
        }
      })
    },

    * update({ payload, staffId }, { call, put }) {
      const data = yield call(update, staffId, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      return yield put(routerRedux.push('/staffs'))
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
          data: response.data.users,
          filter: {
            total: response.data.total,
            limit: response.data.limitPerPage,
            ...payload
          }
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

      RcNotification(MessageConst.Staff.CreateSuccess)

      return yield put(routerRedux.push('/staffs'))
    },

    * changeStatus({ staffId }, { call, put }) {
      const data = yield call(changeStatus, staffId)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateStatus',
        payload: {
          staffId,
          active: response.data.active
        }
      })
    },

    * editUnmount(data, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          staff: null
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
    },
    updateStatus(state, action) {
      const index = lodash.findIndex(state.data, staff => staff._id === action.payload.staffId)
      state.data[index].active = action.payload.active
      return {
        ...state
      }
    }
  }
}
