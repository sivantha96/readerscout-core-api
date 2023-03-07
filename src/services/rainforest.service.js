const { default: axios } = require("axios");
const { InternalServerErrorException } = require("../common/exceptions");
const { ERRORS, URLS } = require("../constants");

const key = process.env.RAINFOREST_API_KEY;

class RainforestService {
    async getProduct(asin) {
        const url = URLS.RAINFOREST_REQUEST;
        const options = {
            params: {
                api_key: key,
                amazon_domain: "amazon.com",
                asin,
                type: "product",
            },
        };

        const res = await axios.get(url, options);

        const data = res.data?.product;

        if (!data) {
            console.log(ERRORS.RAINFOREST_ERROR, data);
            throw new InternalServerErrorException();
        }

        return data;
    }

    async getResults(pageUrls) {
        const allResults = [];

        const promises = pageUrls.map(async (url) => {
            const res = await axios.get(url);
            const requests = res.data;
            requests.forEach((request) => {
                if (request.success) {
                    allResults.push(request.result);
                }
            });
        });

        await Promise.all(promises);

        return allResults;
    }
}

exports.rainforestService = new RainforestService();
