const { UnprocessableEntityException, NotFoundException } = require("../common/exceptions");
const { productService } = require("../services/product.service");
const { rainforestService } = require("../services/rainforest.service");
const { userService } = require("../services/user.service");
const { watchItemService } = require("../services/watch-item.service");
const { sendSuccessResponse } = require("../utils/response-handler");
const { validateAsin } = require("../utils/validations");

exports.getUserWatchlist = async (req, res, next) => {
    try {
        const user = req.user;
        const filter = { user: user._id };
        const watchList = await watchItemService.find(filter, "product");

        if (user.scheduled_for_notification_clear) {
            await watchItemService.resetNotificationsOfUser(user._id);
            await userService.findByIdAndUpdate(user._id, {
                scheduled_for_notification_clear: false,
            });
        }

        const payload = {
            userId: user.hash,
            watchList,
        }
        return sendSuccessResponse(res, payload);
    } catch (error) {
        return next(error);
    }
};

exports.addToUserWatchlist = async (req, res, next) => {
    try {
        const asin = validateAsin(req.body);

        // check if the users watchlist is below limit
        const watchlist = await watchItemService.find({ user: req.user._id });

        if (watchlist.length === 5) {
            throw new UnprocessableEntityException("Watchlist limit reached");
        }

        // check if the product is already in the db
        const foundProduct = await productService.findOne({ asin });

        // check if the user has the product on the watchlist already
        if (foundProduct) {
            const foundWatchItem = watchlist.find(
                (item) => item.product.toString() === foundProduct._id.toString()
            );
            if (foundWatchItem) {
                throw new UnprocessableEntityException("Already on the watchlist");
            }
        }

        // fetch info from rainforest
        const product = await rainforestService.getProduct(asin);

        if (foundProduct) {
            // product already exists in the db

            // check for new changes
            const [hasRatingUpdate, hasPriceUpdate] = productService.hasNewUpdates(
                product,
                foundProduct
            );

            // update the product in the db
            const updatedProduct = await productService.updateProduct(foundProduct, product);

            if (hasRatingUpdate || hasPriceUpdate) {
                // if there are new changes

                // update all the all the watch items from that product
                await watchItemService.incrementAllWatchlistNotification(
                    foundProduct._id,
                    hasRatingUpdate,
                    hasPriceUpdate
                );

                // add the updated product to the requesting user's watchlist and return
                const result = watchItemService.addToWatchlist(updatedProduct, req.user);
                return sendSuccessResponse(res, result);
            }

            // there are no new changes
            // therefore no need to update the other user's watch lists
            // add the found product to the requesting user's watchlist and return
            const result = watchItemService.addToWatchlist(foundProduct, req.user);
            return sendSuccessResponse(res, result);
        }

        // new product
        // save the product
        const savedProduct = await productService.saveProduct(product);

        // add the saved product to the requesting user's watchlist and return
        const result = await watchItemService.addToWatchlist(savedProduct, req.user);

        return sendSuccessResponse(res, result);
    } catch (error) {
        return next(error);
    }
};

exports.updateWatchItem = async (req, res, next) => {
    try {
        const { asin } = req.body;

        // get the product
        const foundProduct = await productService.findOne({ asin });
        if (!foundProduct) throw new NotFoundException("Product cannot be found");

        // get user's all watch items
        const watchlist = await watchItemService.find(
            {
                user: req.user._id,
            },
            "product"
        );

        // check if there are notifications for at least one watch item
        const hasNotifications = watchlist.some(
            (item) => item.notifications_price > 0 || item.notifications_rating > 0
        );

        // do not update from rainforest if the notification count is zero

        let watchItem = await watchItemService.findOne(
            {
                user: req.user._id,
                product: foundProduct._id,
            },
            "product"
        );
        if (!hasNotifications) return sendSuccessResponse(res, watchItem);

        // check if the book of the watch item has been updated recently or not
        const lastModifiedDate = new Date(foundProduct.last_modified_on);

        const timePeriod = 1 * 60 * 60 * 1000; // one hour to the past is checked
        const timeDiff = Date.now() - lastModifiedDate.getTime();

        // do not update from rainforest if its not older than one day
        if (timeDiff < timePeriod) return sendSuccessResponse(res);

        // if the time difference is larger than one day
        // update the product from rainforest
        const product = await rainforestService.getProduct(foundProduct.asin);

        const [hasRatingUpdate, hasPriceUpdate] = productService.hasNewUpdates(
            product,
            foundProduct
        );

        // update the product in the db
        await productService.updateProduct(foundProduct, product);

        if (hasRatingUpdate || hasPriceUpdate) {
            // update notification count of all the watchlist items from that product of all users
            await watchItemService.incrementAllWatchlistNotification(
                foundProduct._id,
                hasRatingUpdate,
                hasPriceUpdate
            );
        }

        // get the latest watch item
        watchItem = await watchItemService.findOne(
            {
                user: req.user._id,
                product: foundProduct._id,
            },
            "product"
        );

        return sendSuccessResponse(res, watchItem);
    } catch (error) {
        return next(error);
    }
};

exports.removeWatchItem = async (req, res, next) => {
    try {
        const filter = {
            _id: req.query?.id || req.params?.id,
            user: req.user._id,
        };

        const foundWatchItem = await watchItemService.findOne(filter);

        // no watch item under the given id
        if (!foundWatchItem) throw new NotFoundException("Item not found");

        // delete the watch item
        await watchItemService.deleteOne(filter);

        return sendSuccessResponse(res);
    } catch (error) {
        return next(error);
    }
};
