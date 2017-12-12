import { AppConst } from '../configs'

export default (role) => {
  switch (role) {
    case AppConst.roles.admin:
      return 'Admin'
    case AppConst.roles.staff:
      return 'Nhân viên checkin'
    case AppConst.roles.cashier:
      return 'Thu ngân'
    default:
      return 'N/A'
  }
}
