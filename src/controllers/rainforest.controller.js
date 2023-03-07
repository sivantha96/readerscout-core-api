const { productService } = require("../services/product.service");
const { rainforestService } = require("../services/rainforest.service");
const { schedularService } = require("../services/schedular.service");
const { watchItemService } = require("../services/watch-item.service");
const { sendSuccessResponse } = require("../utils/response-handler");
const { validateRainforestResults } = require("../utils/validations");

exports.saveBatchResults = async (req, res, next) => {
    try {
        const resultsPages = validateRainforestResults(req.body);

        // get the results from rainforest
        const allResults = await rainforestService.getResults(resultsPages);

        const promises = allResults.map(async (result) => {
            const resProduct = result.product;
            const productId = result.request_parameters?.custom_id;
            const foundProduct = await productService.findById(productId);

            if (foundProduct) {
                const [hasRatingUpdate, hasPriceUpdate] = productService.hasNewUpdates(
                    resProduct,
                    foundProduct
                );

                // update the product with new values
                await productService.updateProduct(foundProduct, resProduct);

                if (hasRatingUpdate || hasPriceUpdate) {
                    // there is a new update

                    // update all the watchlist items's notification count of that product
                    await watchItemService.incrementAllWatchlistNotification(
                        productId,
                        hasRatingUpdate,
                        hasPriceUpdate
                    );
                }
            }
        });

        console.log("Saving results from the rainforest");

        Promise.all(promises);

        schedularService.runSchedular();

        return sendSuccessResponse(res);
    } catch (error) {
        return next(error);
    }
};
