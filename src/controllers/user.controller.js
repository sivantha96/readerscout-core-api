const { userService } = require("../services/user.service");
const { sendSuccessResponse } = require("../utils/response-handler");

exports.clearNotifications = async (req, res, next) => {
    try {
        await userService.findByIdAndUpdate(req.user._id, { scheduled: true });

        return sendSuccessResponse(res);
    } catch (error) {
        return next(error);
    }
};
