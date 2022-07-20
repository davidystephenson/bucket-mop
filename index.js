"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const items_json_1 = __importDefault(require("./items.json"));
function addBucket({ buckets, path, item }) {
    const limit = path.length - 1;
    path.reduce((adding, part, index) => {
        const value = adding[part];
        if (Array.isArray(value)) {
            value.push(item);
            return buckets;
        }
        if (value == null) {
            if (index === limit) {
                adding[part] = [item];
            }
            else {
                adding[part] = {};
            }
        }
        const newValue = adding[part];
        if (!Array.isArray(newValue)) {
            adding = newValue;
        }
        return adding;
    }, buckets);
    return buckets;
}
function bucket({ items, path }) {
    const emptyBuckets = items.reduce((buckets, item) => {
        const bucketValues = path.map(key => String(item[key]));
        const added = addBucket({ buckets, path: bucketValues, item });
        return added;
    }, {});
    return emptyBuckets;
}
const buckets = bucket({ items: items_json_1.default, path: ['city', 'source'] });
const path = ['Amsterdam', 'email'];
let email = buckets;
path.forEach(part => {
    if (Array.isArray(email))
        return;
    console.log('middle test', email);
    email = email[part];
});
console.log('email test:', email);
/*

const x = path.reduce<typeof items>((buckets, part) => {
  const isArray = Array.isArray(buckets)
  if (isArray) {
    return buckets
  }

  const value = buckets[part]

  return value
}, buckets)
const string = JSON.stringify(buckets, null, 2)
console.log('buckets test:', string)

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

const bucket1 = buckets.Amsterdam.email
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