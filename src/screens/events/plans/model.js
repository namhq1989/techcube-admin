import { routerRedux } from 'dva/router'
import { RcNotification } from '../../../components'
import { AppConst, MessageConst } from '../../../configs'
import { load, create, update, listAreas } from './service'

export default {
  namespace: 'plans',
  state: {
    plan: null,
    listAreas: []
  },

  effects: {
    * listAreas({ payload }, { call, put }) {
      const data = yield call(listAreas, payload)
      const response = data.data

      // Alert if failed
      if (!response || !response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateState',
        payload: {
          listAreas: response.data
        }
      })
    },

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
          plan: response.data.plan
        }
      })
    },

    * update({ payload, planId }, { call, put }) {
      const data = yield call(update, planId, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'editUnmount'
      })
      return yield put(routerRedux.push(`/events/${payload.eventId}`))
    },

    * create({ payload }, { call, put }) {
      const data = yield call(create, payload)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      RcNotification(MessageConst.Plan.CreateSuccess)
      yield put({
        type: 'editUnmount'
      })
      return yield put(routerRedux.push(`/events/${payload.eventId}`))
    },

    * editUnmount(data, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          plan: null,
          listAreas: []
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
