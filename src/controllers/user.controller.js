const { userService } = require("../services/user.service");
const { sendSuccessResponse } = require("../utils/response-handler");

exports.clearNotifications = async (req, res, next) => {
    try {
        await userService.findByIdAndUpdate(req.user._id, {
            scheduled_for_notification_clear: true,
        });

        return sendSuccessResponse(res);
    } catch (error) {
        return next(error);
    }
};

exports.updateFollowersCount = async (req, res, next) => {
    try {
        const updatedUser = await userService.findByIdAndUpdate(req.user._id, {
            followers_count: {
                count: req.body.count,
                updated_on: new Date(),
            },
        });

        const { scheduled_for_notification_clear, ...data } = updatedUser.toObject();

        return sendSuccessResponse(res, data);
    } catch (error) {
        return next(error);
    }
};

exports.updateProfilePicture = async (req, res, next) => {
    try {
        const updatedUser = await userService.findByIdAndUpdate(req.user._id, {
            profile_picture: req.body.profile_picture,
        });

        const { scheduled_for_notification_clear, ...data } = updatedUser.toObject();

        return sendSuccessResponse(res, data);
    } catch (error) {
        return next(error);
    }
};

exports.updateAuthorInfo = async (req, res, next) => {
    try {
        const updatedUser = await userService.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
        });

        const { scheduled_for_notification_clear, ...data } = updatedUser.toObject();

        return sendSuccessResponse(res, data);
    } catch (error) {
        return next(error);
    }
};

exports.dismissAuthorLinkSuggestion = async (req, res, next) => {
    try {
        const updatedUser = await userService.findByIdAndUpdate(req.user._id, {
            hide_author_suggestion: true,
        });

        const { scheduled_for_notification_clear, ...data } = updatedUser.toObject();

        return sendSuccessResponse(res, data);
    } catch (error) {
        return next(error);
    }
};
