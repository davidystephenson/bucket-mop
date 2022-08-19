export type BucketOrBuckets <Item> = Buckets<Item> | Item[]

export interface Buckets <Item> {
  [key: string]: BucketOrBuckets<Item>
}

export type MoppedBucketOrBuckets <Mopped> = MoppedBuckets<Mopped> | Mopped
export interface MoppedBuckets <Mopped> {
  [key: string]: MoppedBucketOrBuckets<Mopped>
}

export type Mopper <Mopped> = <Item> ({ mopped, item, mopKey, bucket }: {
  mopped: Mopped
  item: Item
  mopKey: keyof Item
  bucket: Item[]
}) => Mopped

export type BucketMopper <Mopped> = <Item> ({ items, bucketPath, mopKey }: {
  items: Item[]
  bucketPath: Array<keyof Item>
  mopKey: keyof Item
}) => MoppedBuckets<Mopped>

export function addBucket <Item> ({ buckets, path, item }: {
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

export function bucketsFactory <Item> ({ items, path }: {
  items: Item[]
  path: Array<keyof Item>
}): Buckets<Item> {
  const buckets = items.reduce<Buckets<Item>>((buckets, item) => {
    const bucketValues = path.map(key => String(item[key]))

    const added = addBucket({ buckets, path: bucketValues, item })

    return added
  }, {})

  return buckets
}

export function getBucket <Item> ({ buckets, path }: {
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

export function totalMopper <Item> ({ mopped, item, mopKey }: {
  mopped: number
  item: Item
  mopKey: keyof Item
}): number {
  const value = item[mopKey]
  const number = Number(value)

  return mopped + number
}

export function averageMopper <Item> ({ mopped, item, mopKey, bucket }: {
  mopped: number
  item: Item
  mopKey: keyof Item
  bucket: Item[]
}): number {
  const value = item[mopKey]
  const number = Number(value)
  const quotient = number / bucket.length

  return mopped + quotient
}

export function mopBucket <Item, Mopped> ({ bucket, mopper, mopKey, initial }: {
  bucket: Item[]
  mopper: Mopper<Mopped>
  initial: Mopped
  mopKey: keyof Item
}): Mopped {
  const mopped = bucket.reduce((mopped, item) => {
    const reduced = mopper({ mopped, item, mopKey, bucket })

    return reduced
  }, initial)

  return mopped
}

export function mopTotal <Item> ({ bucket, mopKey }: {
  bucket: Item[]
  mopKey: keyof Item
}): number {
  return mopBucket({ bucket, mopper: totalMopper, mopKey, initial: 0 })
}

export function mopBuckets <Item, Mopped> ({ buckets, mopper, initial, mopKey }: {
  buckets: Buckets<Item>
  mopper: Mopper<Mopped>
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

export function bucketMop <Item, Mopped> ({ items, bucketPath, mopper, initial, mopKey }: {
  items: Item[]
  bucketPath: Array<keyof Item>
  mopper: Mopper<Mopped>
  initial: Mopped
  mopKey: keyof Item
}): MoppedBuckets<Mopped> {
  const buckets = bucketsFactory({ items, path: bucketPath })

  return mopBuckets({ buckets, mopper: mopper, initial, mopKey })
}

export function bucketMopTotal <Item> ({ items, bucketPath, mopKey }: {
  items: Item[]
  bucketPath: Array<keyof Item>
  mopKey: keyof Item
}): MoppedBuckets<number> {
  return bucketMop({ items, bucketPath, mopper: totalMopper, initial: 0, mopKey })
}

export function bucketMopAverage <Item> ({ items, bucketPath, mopKey }: {
  items: Item[]
  bucketPath: Array<keyof Item>
  mopKey: keyof Item
}): MoppedBuckets<number> {
  return bucketMop({ items, bucketPath, mopper: averageMopper, initial: 0, mopKey })
}

export function countMopper <Item> ({ bucket }: {
  bucket: Item[]
}): number {
  return bucket.length
}

export function bucketMopCount <Item> ({ items, bucketPath, mopKey }: {
  items: Item[]
  bucketPath: Array<keyof Item>
  mopKey: keyof Item
}): MoppedBuckets<number> {
  return bucketMop({ items, bucketPath, mopper: countMopper, initial: 0, mopKey })
}

export function bucketMopFactory <Mopped> ({ mopper, initial }: {
  mopper: Mopper<Mopped>
  initial: Mopped
}): BucketMopper<Mopped> {
  function product <Item> ({ items, bucketPath, mopKey }: {
    items: Item[]
    bucketPath: Array<keyof Item>
    mopKey: keyof Item
  }): MoppedBuckets<Mopped> {
    return bucketMop({ items, bucketPath, mopper, initial, mopKey })
  }

  return product
}

export default bucketMop
