"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const items_json_1 = __importDefault(require("./items.json"));
console.log('items test:', items_json_1.default);
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
const itemBuckets = bucket({ items: items_json_1.default, path: ['city', 'source'] });
console.log('itemBuckets:', JSON.stringify(itemBuckets, null, 2));
function getBucket({ buckets, path }) {
    let bucket = buckets;
    path.forEach(part => {
        if (Array.isArray(bucket))
            return bucket;
        bucket = bucket[part];
    });
    if (Array.isArray(bucket))
        return bucket;
    throw new Error('Bucket path not found');
}
const amsterdamEmail = getBucket({ buckets: itemBuckets, path: ['Amsterdam', 'email'] });
console.log('amsterdamEmail test:', amsterdamEmail);
function mopBucket({ bucket, mopper, mopKey, initial }) {
    const mopped = bucket.reduce((mopped, item) => {
        const moppedUp = mopper({ mopped, item, mopKey, bucket });
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
function mopTotal({ bucket, totalKey }) {
    return mopBucket({ bucket, mopper: totalReducer, mopKey: totalKey, initial: 0 });
}
const totalEmailPrice = mopTotal({ bucket: amsterdamEmail, totalKey: 'price' });
console.log('totalEmailPrice test:', totalEmailPrice);
function mopBuckets({ buckets, reducer, initial, mopKey }) {
    const mopped = {};
    Object.entries(buckets).forEach(([bucketKey, bucketOrBuckets]) => {
        if (Array.isArray(bucketOrBuckets)) {
            const moppedBucket = mopBucket({ bucket: bucketOrBuckets, mopper: reducer, mopKey, initial });
            mopped[bucketKey] = moppedBucket;
        }
        else {
            const moppedBuckets = mopBuckets({ buckets: bucketOrBuckets, reducer, initial, mopKey });
            mopped[bucketKey] = moppedBuckets;
        }
    });
    return mopped;
}
const bucketTotals = mopBuckets({ buckets: itemBuckets, reducer: totalReducer, mopKey: 'price', initial: 0 });
console.log('bucketTotals test:', bucketTotals);
//# sourceMappingURL=index.js.map