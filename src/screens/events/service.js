import { request } from '../../utils'
import { ApiConst } from '../../configs'

export async function load(data) {
  const api = ApiConst.events.load(data.eventId)
  return request(api.url, {
    method: api.method
  })
}

export async function recent(data) {
  const api = ApiConst.events.recent()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function create(data) {
  const api = ApiConst.events.create()
  return request(api.url, {
    method: api.method,
    body: data
  })
}

export async function update(eventId, data) {
  const api = ApiConst.events.update(eventId)
  return request(api.url, {
    method: api.method,
    body: data
  })
}
