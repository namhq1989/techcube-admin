import { AppConst } from '../configs'

// Check string is phone number or not
function isPhoneNumber(value) {
  return AppConst.regex.phone.test(value) &&
    (value[0] === '0' || (value[0] === '8' && value[1] === '4') || (value[0] === '+' && value[1] === '8' && value[2] === '4'))
}

// Export
export default {
  isPhoneNumber
}
