import { routerRedux } from 'dva/router'
import { RcNotification } from '../../components'
import { AppConst, MessageConst } from '../../configs'
import { load, recent, create, update } from './service'

export default {
  namespace: 'events',
  state: {
    data: [],
    event: null,
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
          event: response.data.event
        }
      })
    },

    * update({ payload, eventId }, { call, put }) {
      const data = yield call(update, eventId, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      return yield put(routerRedux.push(`/events/${eventId}`))
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
          data: response.data.events,
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

      RcNotification(MessageConst.Event.CreateSuccess)

      return yield put(routerRedux.push('/events'))
    },

    * editUnmount(data, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          event: null
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
