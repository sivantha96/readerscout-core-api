const { BadRequestException } = require("../common/exceptions");

module.exports = {
    validateAsin: (body) => {
        if (!body?.asin) {
            throw new BadRequestException();
        }

        return body.asin;
    },
    validateRainforestResults: (body) => {
        if (!body?.result_set?.download_links?.json?.pages) {
            throw new BadRequestException();
        }

        return body.result_set.download_links.json.pages;
    },
};
