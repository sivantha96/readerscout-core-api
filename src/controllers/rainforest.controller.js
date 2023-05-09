const { productService } = require("../services/product.service");
const { rainforestService } = require("../services/rainforest.service");
const { schedularService } = require("../services/schedular.service");
const { watchItemService } = require("../services/watch-item.service");
const { sendSuccessResponse } = require("../utils/response-handler");
const { validateRainforestResults } = require("../utils/validations");

const handleResults = async (resultsPages) => {
    try {
        const allRequests = await rainforestService.getResults(resultsPages);

        const promises = allRequests.map(async (item) => {
            const resProduct = item.result?.product;
            const productId = item.request?.custom_id;
            const foundProduct = await productService.findById(productId);

            if (!resProduct) {
                if (foundProduct) {
                    // mark that product as updated so that it won't be considered for next batch
                    await productService.findByIdAndUpdate(productId, {
                        last_modified_on: new Date(),
                    });
                }
                return;
            }

            console.log("Inside loop allRequests", resProduct, foundProduct);

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

        await Promise.all(promises);

        await schedularService.runSchedular();
    } catch (error) {
        console.log("Error in saving batch results", error);
    }
};

exports.saveBatchResults = async (req, res, next) => {
    try {
        const resultsPages = validateRainforestResults(req.body);

        // get the results from rainforest
        console.log("saveBatchResults start", resultsPages);

        setTimeout(() => {
            handleResults(resultsPages);
        }, 200);

        return sendSuccessResponse(res);
    } catch (error) {
        console.log("Error in saving batch results", error);
        return next(error);
    }
};
