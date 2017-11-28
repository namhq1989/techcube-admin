export default (customerLevel, status) => {
  if (status.totalExpense >= customerLevel.vip.from) {
    return 'V.I.P'
  } else if (status.totalExpense >= customerLevel.normal.from) {
    return 'Thường'
  } else if (status.totalBill === 1) {
    return 'Mới'
  } else {
    return 'Khác'
  }
}
