
const METHODS = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH'
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
    },
    importExcel: () => {
      return {
        url: '/customers/customersByExcel',
        method: METHODS.post
      }
    },
    create: () => {
      return {
        url: '/customers',
        method: METHODS.post
      }
    },
    update: (id) => {
      return {
        url: `/customers/${id}`,
        method: METHODS.put
      }
    },
    load: (id) => {
      return {
        url: `/customers/${id}`,
        method: METHODS.get
      }
    },
    checkin: (id) => {
      return {
        url: `/customers/${id}/checkin`,
        method: METHODS.get
      }
    },
    resend: (id) => {
      return {
        url: `/customers/${id}/resendEmail`,
        method: METHODS.post
      }
    }
  },
  events: {
    recent: () => {
      return {
        url: '/events',
        method: METHODS.get
      }
    },
    create: () => {
      return {
        url: '/events',
        method: METHODS.post
      }
    },
    update: (id) => {
      return {
        url: `/events/${id}`,
        method: METHODS.put
      }
    },
    changeStatus: (id) => {
      return {
        url: `/events/${id}`,
        method: METHODS.patch
      }
    },
    load: (id) => {
      return {
        url: `/events/${id}`,
        method: METHODS.get
      }
    },
    checkin: (id) => {
      return {
        url: `/events/${id}/checkin`,
        method: METHODS.get
      }
    }
  },
  areas: {
    listAreas: (id) => {
      return {
        url: `/areas/event/${id}`,
        method: METHODS.get
      }
    },
    load: (id) => {
      return {
        url: `/areas/${id}`,
        method: METHODS.get
      }
    },
    create: () => {
      return {
        url: '/areas',
        method: METHODS.post
      }
    },
    update: (id) => {
      return {
        url: `/areas/${id}`,
        method: METHODS.put
      }
    },
    changeStatus: (id) => {
      return {
        url: `/areas/${id}`,
        method: METHODS.patch
      }
    }
  },
  plans: {
    load: (id) => {
      return {
        url: `/plans/${id}`,
        method: METHODS.get
      }
    },
    create: () => {
      return {
        url: '/plans',
        method: METHODS.post
      }
    },
    update: (id) => {
      return {
        url: `/plans/${id}`,
        method: METHODS.put
      }
    },
    changeStatus: (id) => {
      return {
        url: `/plans/${id}`,
        method: METHODS.patch
      }
    }
  },
  staffs: {
    recent: () => {
      return {
        url: '/users',
        method: METHODS.get
      }
    },
    create: () => {
      return {
        url: '/users',
        method: METHODS.post
      }
    },
    update: (id) => {
      return {
        url: `/users/${id}`,
        method: METHODS.put
      }
    },
    changeStatus: (id) => {
      return {
        url: `/users/${id}`,
        method: METHODS.patch
      }
    },
    load: (id) => {
      return {
        url: `/users/${id}`,
        method: METHODS.get
      }
    }
  }
}
