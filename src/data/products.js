import monocle from '../../assets/monoclebag.jpg'
import colorful from '../../assets/colorful.jpeg'
import white from '../../assets/images (1).jpeg'
import happy from '../../assets/happybag.jpg'
import peach from '../../assets/peachbasket.jpeg'
import minimalist from '../../assets/minimalist.jpeg'
import zeroWaste from '../../assets/zero-waste.png'
import angel from '../../assets/angel.jpeg'
import jeans from '../../assets/jeans.jpeg'
import cream from '../../assets/MMQ-Tote-Bag.png'

const bags = {
  monocle: { image: monocle, title: 'Green Monocle totebag', rating: 4.5 },
  colorful: { image: colorful, title: 'Striped corduroy totebag', rating: 4 },
  white: { image: white, title: 'Plain white totebag', rating: 3.5 },
  happy: { image: happy, title: 'Black Happy Time totebag', rating: 4.5 },
  peach: { image: peach, title: 'Peachbasket market totebag', rating: 5 },
  minimalist: { image: minimalist, title: 'Minimalist cream totebag', rating: 4 },
  zeroWaste: { image: zeroWaste, title: 'Cream colored totebag', rating: 3.5 },
  angel: { image: angel, title: 'Angel Baby printed totebag', rating: 4.5 },
  jeans: { image: jeans, title: 'Denim totebag', rating: 4 },
  cream: { image: cream, title: 'Plain cream totebag', rating: 3.5 },
}

const description =
  'This totebag is a blend of elegance and functionality. Crafted from luxurious fabric, its spacious interior accommodates daily essentials. Lightweight and stylish, it’s perfect for any occasion, offering comfort and sophistication. The tote features sturdy, reinforced handles for added durability, ensuring it can carry heavier items without compromising on style. Inside, multiple pockets provide organized storage, making it easy to find your keys, phone, or wallet. Its classic colour pairs effortlessly with any outfit, making it a versatile accessory for both casual and formal settings. Whether you’re heading to work, running errands, or enjoying a night out, this tote bag elevates your look while providing practical storage solutions.'

const product = (id, bag) => {
  const { image, title, rating } = bags[bag]
  return { id, image, title, alt: title, rating, description, name: 'Chinos', price: 5000 }
}

export const availableStock = [
  product('a1', 'monocle'),
  product('a2', 'colorful'),
  product('a3', 'white'),
  product('a4', 'happy'),
  product('a5', 'peach'),
  product('a6', 'minimalist'),
  product('a7', 'zeroWaste'),
  product('a8', 'angel'),
  product('a9', 'monocle'),
  product('a10', 'white'),
  product('a11', 'jeans'),
  product('a12', 'happy'),
]

export const otherStock = [
  product('o1', 'monocle'),
  product('o2', 'white'),
  product('o3', 'cream'),
  product('o4', 'happy'),
  product('o5', 'peach'),
  product('o6', 'angel'),
  product('o7', 'minimalist'),
  product('o8', 'zeroWaste'),
  product('o9', 'angel'),
  product('o10', 'peach'),
  product('o11', 'minimalist'),
  product('o12', 'zeroWaste'),
]

export const moreStock = [
  product('m1', 'monocle'),
  product('m2', 'white'),
  product('m3', 'cream'),
  product('m4', 'happy'),
  product('m5', 'peach'),
  product('m6', 'angel'),
  product('m7', 'minimalist'),
  product('m8', 'zeroWaste'),
]

const allProducts = [...availableStock, ...otherStock, ...moreStock]

export const getProduct = (id) => allProducts.find((p) => p.id === id)

// One product per design, excluding the one being viewed.
export const similarProducts = (current, limit = 8) => {
  const seen = new Set([current.image])
  return allProducts
    .filter((p) => !seen.has(p.image) && seen.add(p.image))
    .slice(0, limit)
}

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
