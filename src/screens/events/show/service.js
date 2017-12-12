import { request } from '../../../utils'
import { ApiConst } from '../../../configs'

export async function load(eventId) {
  const api = ApiConst.events.load(eventId)
  return request(api.url, {
    method: api.method
  })
}

export async function checkin(eventId, data) {
  const api = ApiConst.events.checkin(eventId)
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function changeStatus(eventId) {
  const api = ApiConst.events.changeStatus(eventId)
  return request(api.url, {
    method: api.method
  })
}

export async function changeAreaStatus(areaId) {
  const api = ApiConst.areas.changeStatus(areaId)
  return request(api.url, {
    method: api.method
  })
}

export async function changePlanStatus(planId) {
  const api = ApiConst.plans.changeStatus(planId)
  return request(api.url, {
    method: api.method
  })
}
