import items from './items.json'
console.log('items test:', items)

type BucketOrBuckets <Item> = Buckets<Item> | Item[]

interface Buckets <Item> {
  [key: string]: BucketOrBuckets<Item>
}

type MoppedBucketOrBuckets <Mopped> = MoppedBuckets<Mopped> | Mopped
interface MoppedBuckets <Mopped> {
  [key: string]: MoppedBucketOrBuckets<Mopped>
}

function addBucket <Item> ({ buckets, path, item }: {
  buckets: Buckets<Item>
  path: string[]
  item: Item
}): Buckets<Item> {
  const limit = path.length - 1

  path.reduce((adding, part, index) => {
    const value = adding[part]
    if (Array.isArray(value)) {
      value.push(item)
      return buckets
    }
    if (value == null) {
      if (index === limit) {
        adding[part] = [item]
      } else {
        adding[part] = {}
      }
    }
    const newValue = adding[part]
    if (!Array.isArray(newValue)) {
      adding = newValue
    }

    return adding
  }, buckets)

  return buckets
}

function bucket <Item> ({ items, path }: {
  items: Item[]
  path: Array<keyof Item>
}): Buckets<Item> {
  const emptyBuckets = items.reduce<Buckets<Item>>((buckets, item) => {
    const bucketValues = path.map(key => String(item[key]))

    const added = addBucket({ buckets, path: bucketValues, item })

    return added
  }, {})

  return emptyBuckets
}

const citySourceBuckets = bucket({ items, path: ['city', 'source'] })
console.log('citySourceBuckets:', JSON.stringify(citySourceBuckets, null, 2))

function getBucket <Item> ({ buckets, path }: {
  buckets: Buckets<Item>
  path: string[]
}): Item[] {
  let bucket: BucketOrBuckets<Item> = buckets
  path.forEach(part => {
    if (Array.isArray(bucket)) return bucket

    bucket = bucket[part]
  })

  if (Array.isArray(bucket)) return bucket

  throw new Error('Bucket path not found')
}
const amsterdamEmail = getBucket({ buckets: citySourceBuckets, path: ['Amsterdam', 'email'] })
console.log('amsterdamEmail test:', amsterdamEmail)

type Mopper <Item, Mopped> = ({ bucket, mopKey }: {
  mopped: Mopped
  item: Item
  mopKey?: keyof Item
  bucket: Item[]
}) => Mopped

function totalMopper <Item> ({ mopped, item, mopKey }: {
  mopped: number
  item: Item
  mopKey?: keyof Item
}): number {
  if (mopKey == null) throw new Error('totalReducer requires a mopKey')

  const value = item[mopKey]
  const number = Number(value)

  return mopped + number
}

function averageReducer <Item> ({ mopped, item, mopKey, bucket }: {
  mopped: number
  item: Item
  mopKey?: keyof Item
  bucket: Item[]
}): number {
  if (mopKey == null) throw new Error('totalReducer requires a mopKey')

  const value = item[mopKey]
  const number = Number(value)
  const quotient = number / bucket.length

  return mopped + quotient
}

function mopBucket <Item, Mopped> ({ bucket, mopper, mopKey, initial }: {
  bucket: Item[]
  mopper: Mopper<Item, Mopped>
  initial: Mopped
  mopKey?: keyof Item
}): Mopped {
  const mopped = bucket.reduce((mopped, item) => {
    const reduced = mopper({ mopped, item, mopKey, bucket })

    return reduced
  }, initial)

  return mopped
}

function mopTotal <Item> ({ bucket, totalKey }: {
  bucket: Item[]
  totalKey: keyof Item
}): number {
  return mopBucket({ bucket, mopper: totalMopper, mopKey: totalKey, initial: 0 })
}

const totalEmailPrice = mopTotal({ bucket: amsterdamEmail, totalKey: 'price' })
console.log('totalEmailPrice test:', totalEmailPrice)

function mopBuckets <Item, Mopped> ({ buckets, mopper, initial, mopKey }: {
  buckets: Buckets<Item>
  mopper: Mopper<Item, Mopped>
  mopKey: keyof Item
  initial: Mopped
}): MoppedBuckets<Mopped> {
  const mopped: MoppedBuckets<Mopped> = {}
  Object.entries(buckets).forEach(([bucketKey, bucketOrBuckets]) => {
    if (Array.isArray(bucketOrBuckets)) {
      const moppedBucket = mopBucket({ bucket: bucketOrBuckets, mopper: mopper, mopKey, initial })

      mopped[bucketKey] = moppedBucket
    } else {
      const moppedBuckets = mopBuckets({ buckets: bucketOrBuckets, mopper: mopper, initial, mopKey })

      mopped[bucketKey] = moppedBuckets
    }
  })

  return mopped
}

const citySourcePriceTotals = mopBuckets({ buckets: citySourceBuckets, mopper: totalMopper, mopKey: 'price', initial: 0 })
console.log('citySourcePriceTotals test:', citySourcePriceTotals)

function bucketMop <Item, Mopped> ({ items, bucketPath, reducer, initial, mopKey }: {
  items: Item[]
  bucketPath: Array<keyof Item>
  reducer: Mopper<Item, Mopped>
  initial: Mopped
  mopKey: keyof Item
}): MoppedBuckets<Mopped> {
  const buckets = bucket({ items, path: bucketPath })
  console.log('buckets test:', JSON.stringify(buckets, null, 2))

  return mopBuckets({ buckets, mopper: reducer, initial, mopKey })
}

function bucketMopTotal <Item> ({ items, bucketPath, totalKey }: {
  items: Item[]
  bucketPath: Array<keyof Item>
  totalKey: keyof Item
}): MoppedBuckets<number> {
  return bucketMop({ items, bucketPath, reducer: totalMopper, initial: 0, mopKey: totalKey })
}

const quantityTotals = bucketMop({ items, bucketPath: ['source', 'city', 'price'], reducer: totalMopper, initial: 0, mopKey: 'quantity' })
console.log('quantityTotals test:', quantityTotals)

const cityTotals = bucketMopTotal({ items, bucketPath: ['price', 'city'], totalKey: 'quantity' })
console.log('cityTotals test:', cityTotals)

const cityAverages = bucketMop({ items, bucketPath: ['price', 'city'], reducer: averageReducer, initial: 0, mopKey: 'quantity' })
console.log('cityAverages test:', cityAverages)
