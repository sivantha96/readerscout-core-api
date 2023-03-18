const { DB_COLLECTIONS, PROVIDERS } = require("../src/constants");

module.exports = {
    async up(db) {
        await db.collection(DB_COLLECTIONS.USERS).updateMany(
            {
                provider: PROVIDERS.GOOGLE,
            },
            { $set: { hide_author_suggestion: false } }
        );
    },

    async down(db) {
        await db
            .collection(DB_COLLECTIONS.USERS)
            .updateMany({}, { $unset: { hide_author_suggestion: 1 } });
    },
};
