// Shop-side options that the API doesn't model. Closure and colour are chosen
// per bag; delivery is priced by state. The API only charges for the items, so
// these extras are settled on delivery.

// "All" maps to no category filter; the rest must match the product's category exactly.
export const categories = ['All', 'Corduroy', 'Denim', 'Adire', 'Leather']
export const productCategories = [...categories.slice(1), 'Other']
export const productStatuses = ['available', 'out-of-stock', 'inactive']

export const colors = ['White', 'Black', 'Grey']

export const closures = [
  { label: 'Zip', cost: 1000 },
  { label: 'Button', cost: 500 },
  { label: 'Zip or Button', cost: 500 },
  { label: 'None', cost: 0 },
]

export const locations = [
  { label: 'Lagos', fee: 1500 },
  { label: 'Ogun', fee: 2000 },
  { label: 'Oyo', fee: 2500 },
  { label: 'Abuja (FCT)', fee: 3000 },
  { label: 'Rivers', fee: 3000 },
  { label: 'Other states', fee: 3500 },
]

export const DEFAULT_DELIVERY_FEE = locations[0].fee
