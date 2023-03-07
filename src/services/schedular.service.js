const { default: axios } = require("axios");
const { InternalServerErrorException } = require("../common/exceptions");
const { ERRORS, URLS } = require("../constants");

class SchedularService {
    async runSchedular() {
        const url = URLS.SCHEDULAR_API;

        try {
            await axios.get(url);
        } catch (error) {
            console.log(ERRORS.SCHEDULAR_ERROR, error);
            throw new InternalServerErrorException();
        }
    }
}

exports.schedularService = new SchedularService();
