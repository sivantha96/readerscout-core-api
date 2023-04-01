const mongoose = require("mongoose");
const { DB_COLLECTIONS, PROVIDERS } = require("../constants");

const SUser = new mongoose.Schema({
    hash: String,
    added_on: {
        type: Date,
        default: Date.now,
    },
    scheduled_for_notification_clear: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        enum: Object.values(PROVIDERS),
    },
    followers_count: {
        count: {
            type: Number,
        },
        updated_on: {
            type: Date,
        },
    },
    hide_author_suggestion: {
        type: Boolean,
        default: false,
    },
    profile_picture: String,
    google_hash: String,
    name: String,
});

const User = mongoose.model(DB_COLLECTIONS.USERS, SUser);

exports.default = User;
