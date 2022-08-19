"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketMopFactory = exports.bucketMopCount = exports.countMopper = exports.bucketMopAverage = exports.bucketMopTotal = exports.bucketMop = exports.mopBuckets = exports.mopTotal = exports.mopBucket = exports.averageMopper = exports.totalMopper = exports.getBucket = exports.bucketsFactory = exports.addBucket = void 0;
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
exports.addBucket = addBucket;
function bucketsFactory({ items, path }) {
    const buckets = items.reduce((buckets, item) => {
        const bucketValues = path.map(key => String(item[key]));
        const added = addBucket({ buckets, path: bucketValues, item });
        return added;
    }, {});
    return buckets;
}
exports.bucketsFactory = bucketsFactory;
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
exports.getBucket = getBucket;
function totalMopper({ mopped, item, mopKey }) {
    const value = item[mopKey];
    const number = Number(value);
    return mopped + number;
}
exports.totalMopper = totalMopper;
function averageMopper({ mopped, item, mopKey, bucket }) {
    const value = item[mopKey];
    const number = Number(value);
    const quotient = number / bucket.length;
    return mopped + quotient;
}
exports.averageMopper = averageMopper;
function mopBucket({ bucket, mopper, mopKey, initial }) {
    const mopped = bucket.reduce((mopped, item) => {
        const reduced = mopper({ mopped, item, mopKey, bucket });
        return reduced;
    }, initial);
    return mopped;
}
exports.mopBucket = mopBucket;
function mopTotal({ bucket, mopKey }) {
    return mopBucket({ bucket, mopper: totalMopper, mopKey, initial: 0 });
}
exports.mopTotal = mopTotal;
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
exports.mopBuckets = mopBuckets;
function bucketMop({ items, bucketPath, mopper, initial, mopKey }) {
    const buckets = bucketsFactory({ items, path: bucketPath });
    return mopBuckets({ buckets, mopper: mopper, initial, mopKey });
}
exports.bucketMop = bucketMop;
function bucketMopTotal({ items, bucketPath, mopKey }) {
    return bucketMop({ items, bucketPath, mopper: totalMopper, initial: 0, mopKey });
}
exports.bucketMopTotal = bucketMopTotal;
function bucketMopAverage({ items, bucketPath, mopKey }) {
    return bucketMop({ items, bucketPath, mopper: averageMopper, initial: 0, mopKey });
}
exports.bucketMopAverage = bucketMopAverage;
function countMopper({ bucket }) {
    return bucket.length;
}
exports.countMopper = countMopper;
function bucketMopCount({ items, bucketPath, mopKey }) {
    return bucketMop({ items, bucketPath, mopper: countMopper, initial: 0, mopKey });
}
exports.bucketMopCount = bucketMopCount;
function bucketMopFactory({ mopper, initial }) {
    function factorized({ items, bucketPath, mopKey }) {
        return bucketMop({ items, bucketPath, mopper, initial, mopKey });
    }
    return factorized;
}
exports.bucketMopFactory = bucketMopFactory;
exports.default = bucketMop;
//# sourceMappingURL=index.js.map