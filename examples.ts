import bucketMop, { bucketsFactory, getBucket, mopTotal, mopBuckets, bucketMopTotal, bucketMopAverage, averageMopper, totalMopper, bucketMopCount, bucketMopFactory, countMopper } from '.'
import items from './items.json'

const citySourceBuckets = bucketsFactory({ items, path: ['city', 'source'] })
console.log('citySourceBuckets:', JSON.stringify(citySourceBuckets, null, 2))

const amsterdamEmail = getBucket({ buckets: citySourceBuckets, path: ['Amsterdam', 'email'] })
console.log('amsterdamEmail test:', amsterdamEmail)

// export function totalMopper <Item> ({ mopped, item, mopKey }: {
//   mopped: number
//   item: Item
//   mopKey: keyof Item
// }): number {
//   const value = item[mopKey]
//   const number = Number(value)
//
//   return mopped + number
// }

const citySourcePriceTotals = mopBuckets({ buckets: citySourceBuckets, mopper: totalMopper, mopKey: 'price', initial: 0 })
console.log('citySourcePriceTotals test:', citySourcePriceTotals)

const totalEmailPrice = mopTotal({ bucket: amsterdamEmail, mopKey: 'price' })
console.log('totalEmailPrice test:', totalEmailPrice)

const quantityTotals = bucketMop({ items, bucketPath: ['source', 'city', 'price'], mopper: totalMopper, initial: 0, mopKey: 'quantity' })
console.log('quantityTotals test:', quantityTotals)

const cityTotals = bucketMopTotal({ items, bucketPath: ['price', 'city'], mopKey: 'quantity' })
console.log('cityTotals test:', cityTotals)

// export function averageMopper <Item> ({ mopped, item, mopKey, bucket }: {
//   mopped: number
//   item: Item
//   mopKey: keyof Item
//   bucket: Item[]
// }): number {
//   const value = item[mopKey]
//   const number = Number(value)
//   const quotient = number / bucket.length
//
//   return mopped + quotient
// }

const cityAverages = bucketMop({ items, bucketPath: ['price', 'city'], mopper: averageMopper, initial: 0, mopKey: 'quantity' })
console.log('cityAverages test:', cityAverages)

const priceAverages = bucketMopAverage({ items, bucketPath: ['city', 'price'], mopKey: 'quantity' })
console.log('priceAverages test:', priceAverages)

// export function countMopper <Item> ({ bucket }: {
//   bucket: Item[]
// }): number {
//   return bucket.length
// }

const cityCounts = bucketMopCount({ items, bucketPath: ['price', 'city'], mopKey: 'quantity' })
console.log('cityCounts test:', cityCounts)

const c = bucketMopFactory({ mopper: countMopper, initial: 0 })
const d = c({ items, bucketPath: ['price', 'city'], mopKey: 'quantity' })
console.log('d test:', d)

export default bucketMop
