import lodash from 'lodash'
import { RcNotification } from '../../../components'
import { AppConst } from '../../../configs'
import { load, checkin, changeStatus, changeAreaStatus, changePlanStatus } from './service'

export default {
  namespace: 'eventShow',
  state: {
    data: null,
    areas: [],
    plans: [],
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
          plans: response.data.plans,
          areas: response.data.areas,
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
    },

    * changeAreaStatus({ areaId }, { call, put }) {
      const data = yield call(changeAreaStatus, areaId)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updateAreaStatus',
        payload: {
          areaId,
          active: response.data.active
        }
      })
    },

    * changePlanStatus({ planId }, { call, put }) {
      const data = yield call(changePlanStatus, planId)
      const response = data.data

      // Alert if failed
      if (!response.success) {
        return RcNotification(response.message, AppConst.notification.error)
      }

      yield put({
        type: 'updatePlanStatus',
        payload: {
          planId,
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
    },
    updateAreaStatus(state, action) {
      const index = lodash.findIndex(state.areas, area => area._id === action.payload.areaId)
      state.areas[index].active = action.payload.active
      return {
        ...state
      }
    },
    updatePlanStatus(state, action) {
      const index = lodash.findIndex(state.plans, plan => plan._id === action.payload.planId)
      state.plans[index].active = action.payload.active
      return {
        ...state
      }
    }
  }
}
