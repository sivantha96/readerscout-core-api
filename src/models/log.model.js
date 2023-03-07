const mongoose = require("mongoose");
const { DB_COLLECTIONS } = require("../constants");

const SModification = new mongoose.Schema({
    field_name: {
        type: String,
        required: true,
    },
    old_value: String,
    new_value: String,
});

const SLog = new mongoose.Schema({
    model: {
        type: String,
        enum: Object.values(DB_COLLECTIONS),
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "model",
    },
    changed_by: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    modifications: {
        type: [SModification],
        default: [],
    },
});

const Log = mongoose.model(DB_COLLECTIONS.LOGS, SLog);

exports.default = Log;
