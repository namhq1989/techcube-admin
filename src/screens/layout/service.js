import { request } from '../../utils'
import { ApiConst } from '../../configs'

export async function getData() {
  const api = ApiConst.common.getData()
  return request(api.url, {
    method: api.method
  })
}
