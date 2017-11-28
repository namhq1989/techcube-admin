
const METHODS = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete'
}

export default {
  methods: METHODS,
  common: {
    getData: () => {
      return {
        url: '/users/me',
        method: METHODS.get
      }
    }
  },
  login: {
    login: () => {
      return {
        url: '/login',
        method: METHODS.post
      }
    }
  },
  activities: {
    recent: () => {
      return {
        url: '/checkin',
        method: METHODS.get
      }
    }
  },
  customers: {
    recent: () => {
      return {
        url: '/customers',
        method: METHODS.get
      }
    }
  }
}
