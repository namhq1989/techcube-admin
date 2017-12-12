import { routerRedux } from 'dva/router'
import { RcNotification } from '../../../components'
import { AppConst, MessageConst } from '../../../configs'
import { load, create, update } from './service'

export default {
  namespace: 'areas',
  state: {
    area: null
  },

  effects: {
    * load({ payload }, { call, put }) {
      const data = yield call(load, payload)
      const response = data.data

      // Alert if failed
      if (!response || !response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          area: response.data.area
        }
      })
    },

    * update({ payload, areaId }, { call, put }) {
      const data = yield call(update, areaId, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      return yield put(routerRedux.push(`/events/${payload.eventId}`))
    },

    * create({ payload }, { call, put }) {
      const data = yield call(create, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      RcNotification(MessageConst.Area.CreateSuccess)
      return yield put(routerRedux.push(`/events/${payload.eventId}`))
    },

    * editUnmount(data, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          area: null
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
