const { APP_CONFIGS } = require("../config/app.config");

exports.registerWithAmazon = {
    type: "object",
    properties: {
        author: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                },
                asin: {
                    type: "string",
                },
                marketplace: {
                    type: "string",
                },
                customer_id: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                created_at: {
                    type: "string",
                },
                followers_count: {
                    type: "number",
                },
                profile_picture: {
                    type: "string",
                },
            },
            required: ["id", "asin", "marketplace", "name", "followers_count"],
        },
        books: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    faceout: {
                        type: "object",
                        properties: {
                            asin: {
                                type: "string",
                            },
                            title: {
                                type: "string",
                            },
                        },
                    },
                },
                required: ["faceout"],
            },
            maxItems: APP_CONFIGS.BOOK_LIMIT,
        },
    },
    required: ["author", "books"],
};

exports.login = {
    type: "object",
    properties: {
        token: {
            type: "string",
        },
    },
    required: ["token"],
};
