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
    const value = item[mopKey];
    const number = Number(value);
    return mopped + number;
}
function averageMopper({ mopped, item, mopKey, bucket }) {
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
function bucketMop({ items, bucketPath, mopper, initial, mopKey }) {
    const buckets = bucket({ items, path: bucketPath });
    return mopBuckets({ buckets, mopper: mopper, initial, mopKey });
}
function bucketMopTotal({ items, bucketPath, mopKey }) {
    return bucketMop({ items, bucketPath, mopper: totalMopper, initial: 0, mopKey });
}
function bucketMopAverage({ items, bucketPath, mopKey }) {
    return bucketMop({ items, bucketPath, mopper: averageMopper, initial: 0, mopKey });
}
const quantityTotals = bucketMop({ items: items_json_1.default, bucketPath: ['source', 'city', 'price'], mopper: totalMopper, initial: 0, mopKey: 'quantity' });
console.log('quantityTotals test:', quantityTotals);
const cityTotals = bucketMopTotal({ items: items_json_1.default, bucketPath: ['price', 'city'], mopKey: 'quantity' });
console.log('cityTotals test:', cityTotals);
const cityAverages = bucketMop({ items: items_json_1.default, bucketPath: ['price', 'city'], mopper: averageMopper, initial: 0, mopKey: 'quantity' });
console.log('cityAverages test:', cityAverages);
const priceAverages = bucketMopAverage({ items: items_json_1.default, bucketPath: ['city', 'price'], mopKey: 'quantity' });
console.log('priceAverages test:', priceAverages);
function countMopper({ bucket }) {
    return bucket.length;
}
function bucketMopCount({ items, bucketPath, mopKey }) {
    return bucketMop({ items, bucketPath, mopper: countMopper, initial: 0, mopKey });
}
const cityCounts = bucketMopCount({ items: items_json_1.default, bucketPath: ['price', 'city'], mopKey: 'quantity' });
console.log('cityCounts test:', cityCounts);
function bucketMopFactory({ mopper, initial }) {
    function factorized({ items, bucketPath, mopKey }) {
        return bucketMop({ items, bucketPath, mopper, initial, mopKey });
    }
    return factorized;
}
const c = bucketMopFactory({ mopper: countMopper, initial: 0 });
const d = c({ items: items_json_1.default, bucketPath: ['price', 'city'], mopKey: 'quantity' });
console.log('d test:', d);
//# sourceMappingURL=index.js.map