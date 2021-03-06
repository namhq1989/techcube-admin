import { request } from '../../utils'
import { ApiConst } from '../../configs'

export async function load(data) {
  const api = ApiConst.customers.load(data.customerId)
  return request(api.url, {
    method: api.method
  })
}

export async function recent(data) {
  const api = ApiConst.customers.recent()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function importExcel(data) {
  const api = ApiConst.customers.importExcel()
  return request(api.url, {
    method: api.method,
    file: data.file
  })
}

export async function create(data) {
  const api = ApiConst.customers.create()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function update(customerId, data) {
  const api = ApiConst.customers.update(customerId)
  return request(api.url, {
    method: api.method,
    body: data
  })
}
