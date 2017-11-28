import fetch from 'dva/fetch'
import { AppConst, ApiConst } from '../configs'

function parseJSON(response) {
  return response.json()
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function serializeObject(obj) {
  const str = []
  for (const p in obj) {
    if (typeof obj[p] === 'object' && obj[p].length) {
      for (const i in obj[p]) {
        if (Object.prototype.hasOwnProperty.call(obj[p], i)) {
          str.push(`${encodeURIComponent(p)}[]=${encodeURIComponent(obj[p][i])}`)
        }
      }
    } else {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
    }
  }
  return str.join('&')
}

function processOptions(options) {
  if (!options.headers) {
    options.headers = {}
    if (!options.file) {
      options.headers = {
        'Content-Type': 'application/json'
      }
    }
  }

  // Proccess send data
  if (options.method === ApiConst.methods.get) {
    options.query = serializeObject(options.body)
    options.body = undefined
    delete options.body
  } else {
    options.body = JSON.stringify(options.body)
  }

  if (options.file) {
    options.body = new FormData()
    options.body.append('file', options.file)
  }

  let token = localStorage.getItem(AppConst.localStorage.authKey)
  if (options.isAdmin) {
    token = localStorage.getItem(AppConst.localStorage.adminToken)
  }
  if (token) {
    options.headers.Authorization = `Bearer ${token}`
  }

  return options
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  url = AppConst.endpoint + url
  if (!options.method) {
    options.method = ApiConst.methods.get
  }
  options = processOptions(options)
  if (options.query) {
    url += `?${options.query}`
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }))
}
