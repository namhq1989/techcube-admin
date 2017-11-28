import { request } from '../../utils'
import { ApiConst } from '../../configs'

export async function login(data) {
  const api = ApiConst.login.login()
  return request(api.url, {
    method: api.method,
    body: data
  })
}
