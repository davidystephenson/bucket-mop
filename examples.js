"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importStar(require("."));
const items_json_1 = __importDefault(require("./items.json"));
const citySourceBuckets = (0, _1.bucketsFactory)({ items: items_json_1.default, path: ['city', 'source'] });
console.log('citySourceBuckets:', JSON.stringify(citySourceBuckets, null, 2));
const amsterdamEmail = (0, _1.getBucket)({ buckets: citySourceBuckets, path: ['Amsterdam', 'email'] });
console.log('amsterdamEmail test:', amsterdamEmail);
// export function totalMopper <Item> ({ mopped, item, mopKey }: {
//   mopped: number
//   item: Item
//   mopKey: keyof Item
// }): number {
//   const value = item[mopKey]
//   const number = Number(value)
//
//   return mopped + number
// }
const citySourcePriceTotals = (0, _1.mopBuckets)({ buckets: citySourceBuckets, mopper: _1.totalMopper, mopKey: 'price', initial: 0 });
console.log('citySourcePriceTotals test:', citySourcePriceTotals);
const totalEmailPrice = (0, _1.mopTotal)({ bucket: amsterdamEmail, mopKey: 'price' });
console.log('totalEmailPrice test:', totalEmailPrice);
const quantityTotals = (0, _1.default)({ items: items_json_1.default, bucketPath: ['source', 'city', 'price'], mopper: _1.totalMopper, initial: 0, mopKey: 'quantity' });
console.log('quantityTotals test:', quantityTotals);
const cityTotals = (0, _1.bucketMopTotal)({ items: items_json_1.default, bucketPath: ['price', 'city'], mopKey: 'quantity' });
console.log('cityTotals test:', cityTotals);
// export function averageMopper <Item> ({ mopped, item, mopKey, bucket }: {
//   mopped: number
//   item: Item
//   mopKey: keyof Item
//   bucket: Item[]
// }): number {
//   const value = item[mopKey]
//   const number = Number(value)
//   const quotient = number / bucket.length
//
//   return mopped + quotient
// }
const cityAverages = (0, _1.default)({ items: items_json_1.default, bucketPath: ['price', 'city'], mopper: _1.averageMopper, initial: 0, mopKey: 'quantity' });
console.log('cityAverages test:', cityAverages);
const priceAverages = (0, _1.bucketMopAverage)({ items: items_json_1.default, bucketPath: ['city', 'price'], mopKey: 'quantity' });
console.log('priceAverages test:', priceAverages);
// export function countMopper <Item> ({ bucket }: {
//   bucket: Item[]
// }): number {
//   return bucket.length
// }
const cityCounts = (0, _1.bucketMopCount)({ items: items_json_1.default, bucketPath: ['price', 'city'], mopKey: 'quantity' });
console.log('cityCounts test:', cityCounts);
const c = (0, _1.bucketMopFactory)({ mopper: _1.countMopper, initial: 0 });
const d = c({ items: items_json_1.default, bucketPath: ['price', 'city'], mopKey: 'quantity' });
console.log('d test:', d);
exports.default = _1.default;
//# sourceMappingURL=examples.js.map