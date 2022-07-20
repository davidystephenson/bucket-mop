"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const items_json_1 = __importDefault(require("./items.json"));
console.log('items test:', items_json_1.default);
function addBucket({ buckets, parts, item }) {
    const limit = parts.length - 1;
    let adding = buckets;
    for (let i = 0; i < limit + 1; ++i) {
        const partKey = parts[i];
        const value = adding[partKey];
        if (Array.isArray(value)) {
            value.push(item);
            return buckets;
        }
        if (value == null) {
            if (i === limit) {
                adding[partKey] = [item];
            }
            else {
                adding[partKey] = {};
            }
        }
        const newValue = adding[partKey];
        if (!Array.isArray(newValue)) {
            adding = newValue;
        }
    }
    // const addingKey = parts[limit]
    // const addingValue = adding[addingKey]
    // if (addingValue == null) {
    //   adding[addingKey] = [item]
    // } else if (Array.isArray(addingValue)) {
    //   addingValue.push(item)
    // }
    return buckets;
}
;
function bucket({ items, bucketKeys }) {
    const emptyBuckets = items.reduce((buckets, item) => {
        const bucketValues = bucketKeys.map(key => String(item[key]));
        const added = addBucket({ buckets, parts: bucketValues, item });
        return added;
    }, {});
    return emptyBuckets;
}
const buckets = bucket({ items: items_json_1.default, bucketKeys: ['city', 'source'] });
const string = JSON.stringify(buckets, null, 2);
console.log('buckets test:', string);
/*
type Reducer <Item, Mopped> = ({ bucket, mopKey }: {
  mopped: Mopped
  item: Item
  mopKey?: keyof Item
  bucket: Item[]
}) => Mopped

function mop <Item, Mopped> ({ bucket, reducer, mopKey, initial }: {
  bucket: Item[]
  reducer: Reducer<Item, Mopped>
  initial: Mopped
  mopKey?: keyof Item
}): Mopped {
  const mopped = bucket.reduce((mopped, item) => {
    const moppedUp = reducer({ mopped, item, mopKey, bucket })

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

function totalMop <Item> ({ bucket, totalKey }: {
  bucket: Item[]
  totalKey: keyof Item
}): number {
  return mop({ bucket, reducer: totalReducer, mopKey: totalKey, initial: 0 })
}

const bucket1 = buckets['1']
const totaledB = totalMop({ bucket: bucket1, totalKey: 'b' })
console.log('totaledB test:', totaledB)

/*
function mop2 <Item, Mopped> ({ buckets, mopCallback, mopKey }: {
  buckets: Buckets<Item>
  mopCallback: ({ bucket, mopKey }: { bucket: Item[], mopKey?: keyof Item }) => Mopped
  mopKey?: keyof Item
}): Record<string, Mopped> {
  const entries = Object.entries(buckets)

  const mopped = entries.reduce((mopped, [bucketKey, bucket]) => {
    const moppedValue = mopCallback({ bucket, mopKey })
    mopped[bucketKey] = moppedValue

    return mopped
  }, {})

  return mopped
}

function totalMop2 <Item> ({ totalKey, buckets }: {
  totalKey: string
  buckets: Record<string, Item[]>
}): Record<string, number> {
  return mop({ buckets, mopCallback: totalBucket, mopKey: totalKey })
}

const totaled = totalMop({ totalKey: 'a', buckets })
console.log('totaled test:', totaled)

function bucketMop <Item, Schema> ({ buckets }: {
  buckets: string[]
}): Buckets<Item> {
  const bucketed = buckets.reduce<Record<string, Item[]>>((bucketed, bucketKey) => {
  const schemaEntries = Object.entries(schema)
  const result = schemaEntries.reduce((result, [schemaKey, schemaValue]) => {
    if (typeof schemaValue === 'string') {
      switch (schemaValue) {
        case 'items': {
          return data
        }
        case 'total': {
        }
    }
}
*/
//# sourceMappingURL=index.js.map