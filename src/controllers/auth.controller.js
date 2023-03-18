const { UnauthorizedException } = require("../common/exceptions");
const { PROVIDERS } = require("../constants");
const { googleService } = require("../services/google.service");
const { userService } = require("../services/user.service");
const { watchListService } = require("../services/watch-list.service");
const { getHash } = require("../utils");
const { sendSuccessResponse } = require("../utils/response-handler");

exports.convertUserToAmazon = async (req, res, next) => {
    try {
        const hash = getHash(req.body.author.id);

        const foundUser = await userService.findOne({ hash });

        if (foundUser) {
            // if the user has registered with amazon before
            return sendSuccessResponse(res, {
                token: foundUser.hash,
            });
        }

        const updatedUser = await userService.findByIdAndUpdate(req.user._id, {
            provider: PROVIDERS.AMAZON,
            hash,
            hide_author_suggestion: true,
            name: req.body.author.name,
            profile_picture: req.body.author.profile_picture,
            followers_count: {
                count: req.body.author.followers_count,
                updated_on: new Date(),
            },
        });

        await watchListService.createNewBooksAndAddToWatchlist(req.body.books, updatedUser);

        return sendSuccessResponse(res, { token: hash });
    } catch (error) {
        return next(error);
    }
};

exports.registerWithAmazon = async (req, res, next) => {
    try {
        const hash = getHash(req.body.author.id);

        const foundUser = await userService.findOne({ hash });

        if (foundUser) {
            // if the user has registered with amazon before

            await userService.findByIdAndUpdate(foundUser._id, {
                name: req.body.author.name,
                profile_picture: req.body.author.profile_picture,
                followers_count: {
                    count: req.body.author.followers_count,
                    updated_on: new Date(),
                },
            });

            return sendSuccessResponse(res, {
                token: foundUser.hash,
            });
        }

        const newUser = await userService.create({
            hash,
            provider: PROVIDERS.AMAZON,
            hide_author_suggestion: true,
        });

        await watchListService.createNewBooksAndAddToWatchlist(req.body.books, newUser);

        return sendSuccessResponse(res, { token: newUser.hash });
    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        // check if the token is a hashed author id or not

        let foundUser = await userService.findOne({ hash: req.body.token });
        if (foundUser) {
            const { scheduled_for_notification_clear, ...data } = foundUser.toObject();
            return sendSuccessResponse(res, data);
        }

        // check if the token is from google or not

        const userInfo = await googleService.getUserInfo(`Bearer ${req.body.token}`);

        if (!userInfo) throw new UnauthorizedException();

        const hash = getHash(userInfo.email);
        foundUser = await userService.findOne({ hash });

        if (foundUser) {
            const { scheduled_for_notification_clear, ...data } = foundUser.toObject();
            return sendSuccessResponse(res, data);
        }

        throw new UnauthorizedException();
    } catch (error) {
        return next(error);
    }
};
