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

const product = (id, image, alt) => ({ id, image, alt, name: 'Chinos', price: 5000 })

export const availableStock = [
  product('a1', monocle, 'Green Monocle tote bag'),
  product('a2', colorful, 'Striped corduroy tote bag'),
  product('a3', white, 'Plain white tote bag'),
  product('a4', happy, 'Black Happy Time tote bag'),
  product('a5', peach, 'Peachbasket market tote bag'),
  product('a6', minimalist, 'Minimalist cream tote bag'),
  product('a7', zeroWaste, 'Zero Waste cream tote bag'),
  product('a8', angel, 'Angel Baby printed tote bag'),
  product('a9', monocle, 'Green Monocle tote bag'),
  product('a10', white, 'Plain white tote bag'),
  product('a11', jeans, 'Denim tote bag'),
  product('a12', happy, 'Black Happy Time tote bag'),
]

export const otherStock = [
  product('o1', monocle, 'Green Monocle tote bag'),
  product('o2', white, 'Plain white tote bag'),
  product('o3', cream, 'Plain cream tote bag'),
  product('o4', happy, 'Black Happy Time tote bag'),
  product('o5', peach, 'Peachbasket market tote bag'),
  product('o6', angel, 'Angel Baby printed tote bag'),
  product('o7', minimalist, 'Minimalist cream tote bag'),
  product('o8', zeroWaste, 'Zero Waste cream tote bag'),
  product('o9', angel, 'Angel Baby printed tote bag'),
  product('o10', peach, 'Peachbasket market tote bag'),
  product('o11', minimalist, 'Minimalist cream tote bag'),
  product('o12', zeroWaste, 'Zero Waste cream tote bag'),
]

export const moreStock = [
  product('m1', monocle, 'Green Monocle tote bag'),
  product('m2', white, 'Plain white tote bag'),
  product('m3', cream, 'Plain cream tote bag'),
  product('m4', happy, 'Black Happy Time tote bag'),
  product('m5', peach, 'Peachbasket market tote bag'),
  product('m6', angel, 'Angel Baby printed tote bag'),
  product('m7', minimalist, 'Minimalist cream tote bag'),
  product('m8', zeroWaste, 'Zero Waste cream tote bag'),
]
