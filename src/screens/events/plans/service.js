import { request } from '../../../utils'
import { ApiConst } from '../../../configs'

export async function listAreas(data) {
  const api = ApiConst.areas.listAreas(data.eventId)
  return request(api.url, {
    method: api.method
  })
}

export async function load(data) {
  const api = ApiConst.plans.load(data.planId)
  return request(api.url, {
    method: api.method
  })
}

export async function create(data) {
  const api = ApiConst.plans.create()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function update(planId, data) {
  const api = ApiConst.plans.update(planId)
  return request(api.url, {
    method: api.method,
    body: data
  })
}
