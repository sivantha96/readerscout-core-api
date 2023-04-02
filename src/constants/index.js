module.exports = {
    DB_COLLECTIONS: {
        PRODUCTS: "products",
        USERS: "users",
        WATCH_ITEMS: "watch-items",
        LOGS: "logs",
    },
    ERRORS: {
        CONVERT_KIT_ERROR: "CONVERT_KIT_ERROR",
        RAINFOREST_ERROR: "RAINFOREST_ERROR",
        SCHEDULAR_ERROR: "SCHEDULAR_ERROR",
    },
    URLS: {
        GOOGLE_OAUTH: "https://www.googleapis.com/oauth2/v3/userinfo",
        RAINFOREST_REQUEST: "https://api.rainforestapi.com/request",
        RAINFOREST_COLLECTIONS: "https://api.rainforestapi.com/collections",
        WORDPRESS: `${process.env.WORDPRESS_BASE_URL}/wp-json/rs/v1/user`,
        INFO_API: process.env.INFO_API,
        SCHEDULAR_API: process.env.SCHEDULAR_API,
        CONVERT_KIT_API: "https://api.convertkit.com/v3",
    },
    PROVIDERS: {
        GOOGLE: "GOOGLE",
        AMAZON: "AMAZON",
    },
};
