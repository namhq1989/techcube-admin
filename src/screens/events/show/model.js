import { RcNotification } from '../../../components'
import { AppConst } from '../../../configs'
import { load, checkin, changeStatus } from './service'

export default {
  namespace: 'eventShow',
  state: {
    data: null,
    checkin: [],
    active: false,
    filter: {
      total: 0,
      page: 0,
      limit: 20,
      sort: '-date'
    }
  },

  effects: {
    * load({ eventId }, { call, put }) {
      const data = yield call(load, eventId)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          data: response.data.event,
          active: response.data.event.active
        }
      })
    },

    * checkin({ payload, eventId }, { call, put }) {
      const data = yield call(checkin, eventId, payload)
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

    * changeStatus({ eventId }, { call, put }) {
      const data = yield call(changeStatus, eventId)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          active: response.data.active
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
