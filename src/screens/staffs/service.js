import { request } from '../../utils'
import { ApiConst } from '../../configs'

export async function load(data) {
  const api = ApiConst.staffs.load(data.staffId)
  return request(api.url, {
    method: api.method
  })
}

export async function recent(data) {
  const api = ApiConst.staffs.recent()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function create(data) {
  const api = ApiConst.staffs.create()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function update(staffId, data) {
  const api = ApiConst.staffs.update(staffId)
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function changeStatus(staffId) {
  const api = ApiConst.staffs.changeStatus(staffId)
  return request(api.url, {
    method: api.method
  })
}

