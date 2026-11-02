const naira = new Intl.NumberFormat('en-NG')

export const formatNaira = (amount, decimals = false) =>
  `₦${decimals ? amount.toLocaleString('en-NG', { minimumFractionDigits: 2 }) : naira.format(amount)}`

export const formatNumber = (amount) => naira.format(amount)
