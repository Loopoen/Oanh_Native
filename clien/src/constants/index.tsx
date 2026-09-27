
export const COLORS = {
  primaryRed: '#DC3535',
  primaryOrange: '#D17842',
  primaryBlack: '#0C0F14',
  primaryDarkGrey: '#141921',
  primaryGrey: '#252A32',
  primaryLightGrey: '#52555A',
  primaryWhite: '#F3F3F3',
  primaryVeryWhite: '#FFFFFF',

  secondaryDarkGrey: '#21262E',
  secondaryGrey: '#252A32',
  secondaryLightGrey: '#AEAEAE',

  primaryBlackRGBA: 'rgba(12,15,20,0.5)',
  secondaryBlackRGBA: 'rgba(0,0,0,0.7)',
  BlackRGBA30: 'rgba(12,15,20,0.03)',
} as const

export type ColorName = keyof typeof COLORS

  const weights = {
    black: 'Black',
    bold: 'Bold',
    extrabold: 'ExtraBold',
    extralight: 'ExtraLight',
    light: 'Light',
    medium: 'Medium',
    regular: 'Regular',
    semibold: 'SemiBold',
    thin: 'Thin',
  } as const
    
type Weight = keyof typeof weights

export const FONT_FAMILY = Object.fromEntries(
  Object.entries(weights).map(([key, value]) => [
    `poppins_${key}`,
    `Poppins-${value}`,
  ]), 
) as { [K in Weight as `poppins_${K}`]: string }

export const homeTitle = 'Muốn tìm đồ thì hãy tự tìm'

export const lottieUrl =
  'https://lottie.host/1ab06b3e-0271-4ed9-8fc0-ee720b39b005/0YMByi583s.lottie'

export const categories = [
  'All',
  'T-Shirts',
  'Shirts',
  'Hoodies',
  'Sweatshirts',
  'Jackets',
  'Pants',
  'Jeans',
  'Shorts',
  'Suits',
  'Traditional Wear',
  'Shoes',
  'Accessories',
] as const

export type Category = (typeof categories)[number]

export type Size = 'S' | 'M' | 'L'

export type Product = {
  _id: string
  name: string
  description: string
  images: string[]
  prices: { size: Size; price: number }[]
  category: Exclude<Category, 'All'>
  brand: string
  average_rating: number
  ratings_count: string
  quantity: number
}

const prices = ([s, m, l]: [number, number, number]): Product['prices'] => [
  { size: 'S', price: s },
  { size: 'M', price: m },
  { size: 'L', price: l },
]

export const ProductDataSample: Product[] = [
  {
    _id: '1',
    name: 'Classic Crew Cotton Tee',
    description:
      'A soft, breathable 100% organic cotton crew-neck T-shirt—ideal for casual wear, layering or gym days with unmatched comfort.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68',
    ],
    prices: prices([19.99, 21.99, 24.99]),
    category: 'T-Shirts',
    brand: 'Uniqlo',
    average_rating: 4.5,
    ratings_count: '320',
    quantity: 120,
  },
  {
    _id: '2',
    name: 'Graphic Print Tee',
    description:
      'Bold graphic tee with high-quality print that stays vibrant wash after wash—perfect statement piece for casual outings.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f37f3844',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
    ],
    prices: prices([22.99, 24.99, 27.99]),
    category: 'T-Shirts',
    brand: 'H&M',
    average_rating: 4.2,
    ratings_count: '210',
    quantity: 75,
  },
  {
    _id: '3',
    name: 'Longline Oversize Tee',
    description:
      'Relaxed-fit longline tee crafted from heavyweight cotton, great for layering or streetwear styles.',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
      'https://images.unsplash.com/photo-1564859228273-274232fdb516',
    ],
    prices: prices([23.99, 25.99, 28.99]),
    category: 'T-Shirts',
    brand: 'ASOS',
    average_rating: 4.6,
    ratings_count: '145',
    quantity: 60,
  },
  {
    _id: '4',
    name: 'Pocket Essential Tee',
    description:
      'Essential tee with a subtle chest pocket and soft-touch cotton, made for everyday comfort.',
    images: [
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    ],
    prices: prices([20.99, 22.99, 25.99]),
    category: 'T-Shirts',
    brand: 'GAP',
    average_rating: 4.4,
    ratings_count: '98',
    quantity: 90,
  },
  {
    _id: '5',
    name: 'Slim Oxford Shirt',
    description:
      'Refined slim-fit oxford shirt with button-down collar, perfect for both business casual and weekend wear.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    ],
    prices: prices([34.99, 36.99, 39.99]),
    category: 'Shirts',
    brand: 'Banana Republic',
    average_rating: 4.7,
    ratings_count: '180',
    quantity: 55,
  },
  {
    _id: '6',
    name: 'Casual Chambray Shirt',
    description:
      'Soft chambray denim shirt designed for everyday comfort, with relaxed fit and dual chest pockets.',
    images: [
      'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8',
    ],
    prices: prices([32.99, 34.99, 37.99]),
    category: 'Shirts',
    brand: 'Levi’s',
    average_rating: 4.3,
    ratings_count: '120',
    quantity: 40,
  },
  {
    _id: '7',
    name: 'Striped Relaxed Shirt',
    description:
      'Comfortable striped shirt in lightweight fabric with a relaxed silhouette—ideal for smart-casual occasions.',
    images: [
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e',
    ],
    prices: prices([30.99, 33.99, 36.99]),
    category: 'Shirts',
    brand: 'J. Crew',
    average_rating: 4.2,
    ratings_count: '75',
    quantity: 65,
  },
  {
    _id: '8',
    name: 'Pullover Fleece Hoodie',
    description:
      'Cozy fleece hoodie with kangaroo pocket and drawcord hood—ideal for lounging or quick errands.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633',
    ],
    prices: prices([44.99, 46.99, 49.99]),
    category: 'Hoodies',
    brand: 'Champion',
    average_rating: 4.6,
    ratings_count: '210',
    quantity: 80,
  },
  {
    _id: '9',
    name: 'Zip-Up Tech Hoodie',
    description:
      'Lightweight, quick-dry tech hoodie with full zip and side pockets—perfect for active mornings.',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
      'https://images.unsplash.com/photo-1578681994506-b8f463449011',
    ],
    prices: prices([48.99, 50.99, 54.99]),
    category: 'Hoodies',
    brand: 'Nike',
    average_rating: 4.7,
    ratings_count: '130',
    quantity: 60,
  },
  {
    _id: '12',
    name: 'Heavyweight Pullover Hoodie',
    description:
      'Thick cotton-blend hoodie with reinforced seams and soft-brushed interior—built to last and stay warm.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
    ],
    prices: prices([52.99, 54.99, 59.99]),
    category: 'Hoodies',
    brand: 'Patagonia',
    average_rating: 4.8,
    ratings_count: '95',
    quantity: 55,
  },
  {
    _id: '13',
    name: 'Crewneck Pullover Sweatshirt',
    description:
      'Soft terry cotton crewneck sweatshirt with ribbed cuffs and hem—perfect blend of comfort and durability.',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
    ],
    prices: prices([39.99, 42.99, 45.99]),
    category: 'Sweatshirts',
    brand: 'Hanes',
    average_rating: 4.4,
    ratings_count: '110',
    quantity: 70,
  },
]

