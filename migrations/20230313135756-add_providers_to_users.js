const { DB_COLLECTIONS, PROVIDERS } = require("../src/constants");

module.exports = {
    async up(db) {
        await db
            .collection(DB_COLLECTIONS.USERS)
            .updateMany({}, { $set: { provider: PROVIDERS.GOOGLE } });
    },

    async down(db) {
        await db.collection(DB_COLLECTIONS.USERS).updateMany({}, { $unset: { provider: 1 } });
    },
};
