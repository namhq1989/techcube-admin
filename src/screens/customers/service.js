import { request } from '../../utils'
import { ApiConst } from '../../configs'

export async function recent(data) {
  const api = ApiConst.customers.recent()
  return request(api.url, {
    method: api.method,
    body: data
  })
}
