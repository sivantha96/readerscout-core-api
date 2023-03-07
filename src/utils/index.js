const crypto = require("crypto");

module.exports = {
    addParamsToURL: (url, params) => {
        const formattedURL = new URL(url);

        Object.entries(params)?.forEach((param) => {
            const [key, value] = param;
            formattedURL.searchParams.append(key, value);
        });

        return formattedURL.toString();
    },
    setParamsToURL: (url, params) => {
        const formattedURL = new URL(url);

        Object.entries(params)?.forEach((param) => {
            const [key, value] = param;
            formattedURL.searchParams.set(key, value);
        });

        return formattedURL.toString();
    },
    getHash: (value) => {
        return crypto.pbkdf2Sync(value, process.env.SALT, 1000, 64, `sha512`).toString(`hex`);
    },
    checkHash: (hash, value) => {
        const newHash = crypto
            .pbkdf2Sync(value, process.env.SALT, 1000, 64, `sha512`)
            .toString(`hex`);
        return hash === newHash;
    },
    getReviewsURL: (asin) => {
        return `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_arp_d_viewopt_srt`;
    },
};
