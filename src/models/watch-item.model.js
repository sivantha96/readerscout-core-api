const mongoose = require("mongoose");
const { DB_COLLECTIONS } = require("../constants");

const SWatchItem = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: DB_COLLECTIONS.PRODUCTS,
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: DB_COLLECTIONS.USERS,
    },
    notifications_rating: {
        type: Number,
        default: 0,
    },
    notifications_price: {
        type: Number,
        default: 0,
    },
    added_on: {
        type: Date,
        default: Date.now,
    },
});

const WatchItem = mongoose.model(DB_COLLECTIONS.WATCH_ITEMS, SWatchItem);

exports.default = WatchItem;
