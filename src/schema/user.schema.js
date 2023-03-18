exports.updateFollowersCount = {
    type: "object",
    properties: {
        count: {
            type: "number",
        },
    },
    required: ["count"],
};

exports.updateProfilePicture = {
    type: "object",
    properties: {
        profile_picture: {
            type: "string",
        },
    },
    required: ["profile_picture"],
};

exports.updateAuthorInfo = {
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
    required: ["id", "asin", "marketplace", "name"],
};
