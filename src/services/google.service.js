const { default: axios } = require("axios");
const { UnauthorizedException } = require("../common/exceptions");
const { URLS } = require("../constants");

class GoogleService {
    async getUserInfo(authHeader) {
        if (!authHeader) throw new UnauthorizedException();

        const url = URLS.GOOGLE_OAUTH;
        const options = {
            headers: {
                Authorization: authHeader,
            },
        };

        try {
            const res = await axios.get(url, options);
            return res.data;
        } catch (error) {
            return null;
        }
    }
}

exports.googleService = new GoogleService();
