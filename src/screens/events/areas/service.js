import { request } from '../../../utils'
import { ApiConst } from '../../../configs'

export async function load(data) {
  const api = ApiConst.areas.load(data.areaId)
  return request(api.url, {
    method: api.method
  })
}

export async function create(data) {
  const api = ApiConst.areas.create()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function update(areaId, data) {
  const api = ApiConst.areas.update(areaId)
  return request(api.url, {
    method: api.method,
    body: data
  })
}
