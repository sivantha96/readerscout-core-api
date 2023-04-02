const express = require("express");
const router = express.Router();

const watchlistController = require("../controllers/watchlist.controller");
const { checkAuth } = require("../middleware/check-auth.middleware");
const validateBody = require("../middleware/validate-body.middleware");
const watchlistSchema = require("../schema/watchlist.schema");

router.get("/", checkAuth(), watchlistController.getUserWatchlist);

router.post(
    "/",
    checkAuth(),
    validateBody(watchlistSchema.asinBody),
    watchlistController.addToUserWatchlist
);

router.patch(
    "/:id",
    checkAuth(),
    validateBody(watchlistSchema.asinBody),
    watchlistController.updateWatchItem
);

router.delete("/:id", checkAuth(), watchlistController.removeWatchItem);

module.exports = router;
