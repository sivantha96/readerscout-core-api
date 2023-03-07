const { default: axios } = require("axios");
const { InternalServerErrorException } = require("../common/exceptions");
const { ERRORS, URLS } = require("../constants");

const CONVERT_KIT_NEWSLETTER_FORM_ID = 3776773;
const key = process.env.CONVERT_KIT_API_KEY;

class ConvertKitService {
    async subscribeToNewsLetter(email) {
        const url = `${URLS.CONVERT_KIT_API}/forms/${CONVERT_KIT_NEWSLETTER_FORM_ID}/subscribe`;

        const body = {
            api_key: key,
            email,
        };
        try {
            const res = await axios.post(url, body);
            return res.data;
        } catch (error) {
            console.log(ERRORS.CONVERT_KIT_ERROR, error);
            throw new InternalServerErrorException();
        }
    }
}

exports.convertKitService = new ConvertKitService();
