const { DB_COLLECTIONS } = require("../src/constants");

module.exports = {
    async up(db) {
        await db.collection(DB_COLLECTIONS.PRODUCTS).updateMany({}, { $set: { manual: true } });
    },

    async down(db) {
        await db.collection(DB_COLLECTIONS.PRODUCTS).updateMany({}, { $unset: { manual: 1 } });
    },
};
