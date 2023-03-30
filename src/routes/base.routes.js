const express = require("express");
const router = express.Router();

const { checkGoogleAuth } = require("../middleware/check-auth.middleware");
const validateBody = require("../middleware/validate-body.middleware");

const watchlistSchema = require("../schema/watchlist.schema");

const watchlistController = require("../controllers/watchlist.controller");
const rainforestController = require("../controllers/rainforest.controller");
const userController = require("../controllers/user.controller");

router.get(
    "/",
    checkGoogleAuth({ allowAuthFromUserId: true }),
    watchlistController.getUserWatchlist
);

router.put(
    "/",
    checkGoogleAuth({ allowAuthFromUserId: false }),
    watchlistController.addToUserWatchlist
);

router.patch(
    "/",
    checkGoogleAuth({ allowAuthFromUserId: true }),
    validateBody(watchlistSchema.asinBody),
    watchlistController.updateWatchItem
);

router.post("/", rainforestController.saveBatchResults);

router.delete("/", checkGoogleAuth({ allowAuthFromUserId: false }), (req, res, next) => {
    if (req.query.type.toString() === "book") {
        return watchlistController.removeWatchItem(req, res, next);
    }

    if (req.query.type.toString() === "notification") {
        return userController.clearNotifications(req, res, next);
    }

    next();
});

module.exports = router;
