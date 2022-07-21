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
const citySourceBuckets = bucket({ items: items_json_1.default, path: ['city', 'source'] });
console.log('citySourceBuckets:', JSON.stringify(citySourceBuckets, null, 2));
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
const amsterdamEmail = getBucket({ buckets: citySourceBuckets, path: ['Amsterdam', 'email'] });
console.log('amsterdamEmail test:', amsterdamEmail);
function totalMopper({ mopped, item, mopKey }) {
    if (mopKey == null)
        throw new Error('totalReducer requires a mopKey');
    const value = item[mopKey];
    const number = Number(value);
    return mopped + number;
}
function averageReducer({ mopped, item, mopKey, bucket }) {
    if (mopKey == null)
        throw new Error('averageReducer requires a mopKey');
    const value = item[mopKey];
    const number = Number(value);
    const quotient = number / bucket.length;
    return mopped + quotient;
}
function mopBucket({ bucket, mopper, mopKey, initial }) {
    const mopped = bucket.reduce((mopped, item) => {
        const reduced = mopper({ mopped, item, mopKey, bucket });
        return reduced;
    }, initial);
    return mopped;
}
function mopTotal({ bucket, totalKey }) {
    return mopBucket({ bucket, mopper: totalMopper, mopKey: totalKey, initial: 0 });
}
const totalEmailPrice = mopTotal({ bucket: amsterdamEmail, totalKey: 'price' });
console.log('totalEmailPrice test:', totalEmailPrice);
function mopBuckets({ buckets, mopper, initial, mopKey }) {
    const mopped = {};
    Object.entries(buckets).forEach(([bucketKey, bucketOrBuckets]) => {
        if (Array.isArray(bucketOrBuckets)) {
            const moppedBucket = mopBucket({ bucket: bucketOrBuckets, mopper: mopper, mopKey, initial });
            mopped[bucketKey] = moppedBucket;
        }
        else {
            const moppedBuckets = mopBuckets({ buckets: bucketOrBuckets, mopper: mopper, initial, mopKey });
            mopped[bucketKey] = moppedBuckets;
        }
    });
    return mopped;
}
const citySourcePriceTotals = mopBuckets({ buckets: citySourceBuckets, mopper: totalMopper, mopKey: 'price', initial: 0 });
console.log('citySourcePriceTotals test:', citySourcePriceTotals);
function bucketMop({ items, bucketPath, reducer, initial, mopKey }) {
    const buckets = bucket({ items, path: bucketPath });
    console.log('buckets test:', JSON.stringify(buckets, null, 2));
    return mopBuckets({ buckets, mopper: reducer, initial, mopKey });
}
function bucketMopTotal({ items, bucketPath, totalKey }) {
    return bucketMop({ items, bucketPath, reducer: totalMopper, initial: 0, mopKey: totalKey });
}
const quantityTotals = bucketMop({ items: items_json_1.default, bucketPath: ['source', 'city', 'price'], reducer: totalMopper, initial: 0, mopKey: 'quantity' });
console.log('quantityTotals test:', quantityTotals);
const cityTotals = bucketMopTotal({ items: items_json_1.default, bucketPath: ['price', 'city'], totalKey: 'quantity' });
console.log('cityTotals test:', cityTotals);
const cityAverages = bucketMop({ items: items_json_1.default, bucketPath: ['price', 'city'], reducer: averageReducer, initial: 0, mopKey: 'quantity' });
console.log('cityAverages test:', cityAverages);
//# sourceMappingURL=index.js.map