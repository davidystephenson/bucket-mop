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

const itemBuckets = bucket({ items, path: ['city', 'source'] })
console.log('itemBuckets:', JSON.stringify(itemBuckets, null, 2))

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
const amsterdamEmail = getBucket({ buckets: itemBuckets, path: ['Amsterdam', 'email'] })
console.log('amsterdamEmail test:', amsterdamEmail)

type Mopper <Item, Mopped> = ({ bucket, mopKey }: {
  mopped: Mopped
  item: Item
  mopKey?: keyof Item
  bucket: Item[]
}) => Mopped

function mopBucket <Item, Mopped> ({ bucket, mopper, mopKey, initial }: {
  bucket: Item[]
  mopper: Mopper<Item, Mopped>
  initial: Mopped
  mopKey?: keyof Item
}): Mopped {
  const mopped = bucket.reduce((mopped, item) => {
    const moppedUp = mopper({ mopped, item, mopKey, bucket })

    return moppedUp
  }, initial)

  return mopped
}

function totalReducer <Item> ({ mopped, item, mopKey }: {
  mopped: number
  item: Item
  mopKey?: keyof Item
}): number {
  if (mopKey == null) throw new Error('totalReducer requires a mopKey')

  const value = item[mopKey]
  const number = Number(value)

  return mopped + number
}

function mopTotal <Item> ({ bucket, totalKey }: {
  bucket: Item[]
  totalKey: keyof Item
}): number {
  return mopBucket({ bucket, mopper: totalReducer, mopKey: totalKey, initial: 0 })
}

const totalEmailPrice = mopTotal({ bucket: amsterdamEmail, totalKey: 'price' })
console.log('totalEmailPrice test:', totalEmailPrice)

function mopBuckets <Item, Mopped> ({ buckets, reducer, initial, mopKey }: {
  buckets: Buckets<Item>
  reducer: Mopper<Item, Mopped>
  mopKey: keyof Item
  initial: Mopped
}): MoppedBuckets<Mopped> {
  const mopped: MoppedBuckets<Mopped> = {}
  Object.entries(buckets).forEach(([bucketKey, bucketOrBuckets]) => {
    if (Array.isArray(bucketOrBuckets)) {
      const moppedBucket = mopBucket({ bucket: bucketOrBuckets, mopper: reducer, mopKey, initial })

      mopped[bucketKey] = moppedBucket
    } else {
      const moppedBuckets = mopBuckets({ buckets: bucketOrBuckets, reducer, initial, mopKey })

      mopped[bucketKey] = moppedBuckets
    }
  })

  return mopped
}

const bucketTotals = mopBuckets({ buckets: itemBuckets, reducer: totalReducer, mopKey: 'price', initial: 0 })
console.log('bucketTotals test:', bucketTotals)
