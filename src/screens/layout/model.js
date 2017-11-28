import queryString from 'query-string'
import { routerRedux } from 'dva/router'
import { RcNotification } from '../../components'
import { AppConst, MessageConst } from '../../configs'
import { getData } from './service'

export default {
  namespace: 'app',
  state: {
    profile: null,
    locationPathname: '',
    locationQuery: {},
  },

  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          }
        })
      })
    },
    setup({ dispatch }) {
      dispatch({ type: 'init' })
    }
  },

  effects: {
    * init({ payload }, { call, put }) {
      const token = localStorage.getItem(AppConst.localStorage.authKey)

      // Redirect to login page if token not found
      if (!token) {
        return yield put(routerRedux.push('/login'))
      }

      // Get user data
      const { data } = yield call(getData)

      // Return to login page if not success
      if (!data || !data.success) {
        // Remove token
        localStorage.removeItem(AppConst.localStorage.authKey)
        if (location.pathname === '/login') {
          RcNotification(MessageConst.NoPermission, AppConst.notification.error)
        } else {
          return yield put(routerRedux.push('/login'))
        }
      }

      // Update state to models
      yield put({
        type: 'updateState',
        payload: {
          profile: data.data
        }
      })

      if (['/login'].includes(location.pathname)) {
        yield put(routerRedux.push('/home'))
      }
    },

    * logout(data, { put }) {
      // Remove token
      localStorage.removeItem(AppConst.localStorage.authKey)

      yield put({
        type: 'updateState',
        payload: {
          profile: null
        }
      })

      // Redirect to login page
      window.location.href = '/login'
    }
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
}
