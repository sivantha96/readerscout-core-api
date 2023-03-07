const mongoose = require("mongoose");
const { DB_COLLECTIONS } = require("../constants");

const SUser = new mongoose.Schema({
    hash: String,
    added_on: {
        type: Date,
        default: Date.now,
    },
    scheduled: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model(DB_COLLECTIONS.USERS, SUser);

exports.default = User;
