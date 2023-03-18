const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authSchema = require("../schema/auth.schema");
const validateBody = require("../middleware/validate-body.middleware");
const { checkAuth } = require("../middleware/check-auth.middleware");

router.post(
    "/amazon",
    validateBody(authSchema.registerWithAmazon),
    authController.registerWithAmazon
);

router.post(
    "/change-to-amazon",
    checkAuth(),
    validateBody(authSchema.registerWithAmazon),
    authController.convertUserToAmazon
);

router.post("/login", validateBody(authSchema.login), authController.login);

module.exports = router;
