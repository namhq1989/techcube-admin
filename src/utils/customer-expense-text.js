export default (fromExpense = 0, toExpense = 0) => {
  fromExpense = castNumberToVNDText(fromExpense)
  toExpense = castNumberToVNDText(toExpense)

  if (!fromExpense && !toExpense) {
    return 'Số tiền không hợp lệ'
  } else if (!fromExpense) {
    return `Chi tiêu dưới ${toExpense}`
  } else if (!toExpense) {
    return `Chi tiêu trên ${fromExpense}`
  } else {
    return `Chi tiêu từ ${fromExpense} đến ${toExpense}`
  }
}

export const castNumberToVNDText = (value) => {
  if (!value || parseInt(value, 10) === 0) {
    return '0'
  }

  value = Math.round(value / 1000)

  if (value < 1000) {
    return `${value} nghìn`
  } else {
    let mil = Math.floor(value / 1000)
    if (mil < 1000) {
      const thousand = value % 1000
      return `${mil} triệu ${(thousand ? ` ${thousand} nghìn` : '')}`
    } else {
      const bil = Math.floor(mil / 1000)
      mil %= 1000
      const thousand = value % 1000
      return `${bil} tỷ ${(mil ? ` ${mil} triệu` : '')} ${(thousand ? ` ${thousand} nghìn` : '')}`
    }
  }
}
