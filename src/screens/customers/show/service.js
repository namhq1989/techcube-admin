import { request } from '../../../utils'
import { ApiConst } from '../../../configs'

export async function load(data) {
  const api = ApiConst.customers.load(data.customerId)
  return request(api.url, {
    method: api.method
  })
}

export async function checkin(data) {
  const api = ApiConst.customers.checkin(data.customerId)
  data.customerId = undefined
  delete data.customerId
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function resend(customerId) {
  const api = ApiConst.customers.resend(customerId)
  return request(api.url, {
    method: api.method
  })
}

