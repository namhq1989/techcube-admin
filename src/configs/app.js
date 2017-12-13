import moment from 'moment'

const LocalStoragePrefix = (process.env.NODE_ENV === 'production') ? 'imed-' : 'imed-dev-'

export default {
  name: 'IMED',

  // endpoint: 'http://127.0.0.1:3000',
  endpoint: 'http://139.59.246.187:3000',
  // endpoint: 'https://api.imed.com.vn',

  // Screen size
  screens: {
    'xs-max': 480,
    'sm-min': 481,
    'sm-max': 767,
    'md-min': 768,
    'md-max': 991,
    'lg-min': 992,
    'lg-max': 1199,
    'xl-min': 1200
  },

  // Local storage
  localStorage: {
    authKey: `${LocalStoragePrefix}admin`
  },

  // Notification level
  notification: {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  },

  // Regex
  regex: {
    email: /\S+@\S+\.\S+/,
    phone: /^\+?1?(\d{10,12}$)/
  },

  // Format
  format: {
    date: 'DD/MM/YYYY, HH:mm',
    dateWithNoHour: 'DD/MM/YYYY',
    dateWithDayMonthOnly: 'DD/MM'
  },

  // App user roles
  roles: {
    admin: 'admin',
    staff: 'staff',
    cashier: 'cashier'
  },

  // Components default data
  components: {
    rangePicker: {
      start: moment().subtract(30, 'd').startOf('d').toISOString(),
      end: moment().endOf('d').toISOString()
    }
  }
}
