const { DB_COLLECTIONS } = require("../src/constants");

module.exports = {
    async up(db) {
        await db
            .collection(DB_COLLECTIONS.USERS)
            .updateMany({}, { $rename: { scheduled: "scheduled_for_notification_clear" } });
    },

    async down(db) {
        await db
            .collection(DB_COLLECTIONS.USERS)
            .updateMany({}, { $rename: { scheduled_for_notification_clear: "scheduled" } });
    },
};
