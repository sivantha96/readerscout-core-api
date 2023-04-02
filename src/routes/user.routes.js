const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { checkAuth } = require("../middleware/check-auth.middleware");
const validateBody = require("../middleware/validate-body.middleware");
const userSchema = require("../schema/user.schema");

router.patch(
    "/followers-count",
    checkAuth(),
    validateBody(userSchema.updateFollowersCount),
    userController.updateFollowersCount
);

router.patch(
    "/profile-picture",
    checkAuth(),
    validateBody(userSchema.updateProfilePicture),
    userController.updateProfilePicture
);

router.patch(
    "/author-info",
    checkAuth(),
    validateBody(userSchema.updateAuthorInfo),
    userController.updateAuthorInfo
);

router.patch("/author-link-suggestion", checkAuth(), userController.dismissAuthorLinkSuggestion);

router.delete("/notifications", checkAuth(), userController.clearNotifications);

module.exports = router;
