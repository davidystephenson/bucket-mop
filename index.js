"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const items_json_1 = __importDefault(require("./items.json"));
function bucket({ items, bucketKey }) {
    const buckets = items.reduce((buckets, item) => {
        const bucketValue = String(item[bucketKey]);
        if (buckets[bucketValue] != null) {
            buckets[bucketValue].push(item);
        }
        else {
            buckets[bucketValue] = [item];
        }
        return buckets;
    }, {});
    return buckets;
}
const buckets = bucket({ items: items_json_1.default, bucketKey: 'b' });
const string = JSON.stringify(buckets, null, 2);
console.log('buckets test:', string);
function mop({ bucket, reducer, mopKey, initial }) {
    const mopped = bucket.reduce((mopped, item) => {
        const moppedUp = reducer({ mopped, item, mopKey, bucket });
        return moppedUp;
    }, initial);
    return mopped;
}
function totalReducer({ mopped, item, mopKey }) {
    if (mopKey == null)
        throw new Error('totalReducer requires a mopKey');
    const value = item[mopKey];
    const number = Number(value);
    return mopped + number;
}
function totalMop({ bucket, totalKey }) {
    return mop({ bucket, reducer: totalReducer, mopKey: totalKey, initial: 0 });
}
const bucket1 = buckets['1'];
const totaledB = totalMop({ bucket: bucket1, totalKey: 'b' });
console.log('totaledB test:', totaledB);
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
