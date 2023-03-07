const { default: axios } = require("axios");
const { ERRORS, URLS } = require("../constants");

const secret = process.env.WORDPRESS_SECRET;

class WordpressService {
    async createUser(userId) {
        const url = URLS.WORDPRESS;

        try {
            await axios.post(url, {
                userId,
                secret,
            });
            return true;
        } catch (error) {
            // the wordpress error get handled by the wordpress side
            console.log(ERRORS.WORDPRESS_ERROR, error);
        }
    }
}

exports.wordpressService = new WordpressService();
