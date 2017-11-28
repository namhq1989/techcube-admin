import { request } from '../../utils'
import { ApiConst } from '../../configs'

export async function recentBills(data) {
  const api = ApiConst.common.recentBills()
  return request(api.url, {
    method: api.method,
    body: data
  })
}
