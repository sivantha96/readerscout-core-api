const { UnauthorizedException } = require("../common/exceptions");
const jwt = require("jsonwebtoken");
const { PROVIDERS } = require("../constants");
const { googleService } = require("../services/google.service");
const { userService } = require("../services/user.service");
const { watchListService } = require("../services/watch-list.service");
const { getHash } = require("../utils");
const { sendSuccessResponse } = require("../utils/response-handler");
const { wordpressService } = require("../services/wordpress.service");

exports.convertUserToAmazon = async (req, res, next) => {
    try {
        const hash = getHash(req.body.author.id);

        const foundUser = await userService.findOne({ hash });

        if (foundUser) {
            // if the user has registered with amazon before

            //  if there is no google account linked to the amazon account then link the current account to it
            if (!foundUser.google_hash) {
                await userService.findByIdAndUpdate(foundUser._id.toString(), {
                    google_hash: req.user.hash,
                });
            }

            // add the current account's books to the list if the list is not full
            await watchListService.createNewBooksAndAddToWatchlist(req.body.books, foundUser);

            const token = jwt.sign({ hash: foundUser.hash }, process.env.JWT_SECRET);

            return sendSuccessResponse(res, {
                token,
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
            google_hash: req.user.hash,
        });

        await wordpressService.createUser(hash);

        await watchListService.createNewBooksAndAddToWatchlist(req.body.books, updatedUser);

        const token = jwt.sign({ hash }, process.env.JWT_SECRET);

        return sendSuccessResponse(res, { token });
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

            const token = jwt.sign({ hash: foundUser.hash }, process.env.JWT_SECRET);

            return sendSuccessResponse(res, { token });
        }

        const newUser = await userService.create({
            hash,
            provider: PROVIDERS.AMAZON,
            hide_author_suggestion: true,
            profile_picture: req.body.author.profile_picture,
            followers_count: {
                count: req.body.author.followers_count,
                updated_on: new Date(),
            },
        });

        await wordpressService.createUser(hash);

        await watchListService.createNewBooksAndAddToWatchlist(req.body.books, newUser);

        const token = jwt.sign({ hash: newUser.hash }, process.env.JWT_SECRET);

        return sendSuccessResponse(res, { token });
    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        // check if the token is valid jwt or not

        let decoded;
        try {
            decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
        } catch (err) {
            decoded = null;
        }

        let foundUser;
        if (decoded) {
            foundUser = await userService.findOne({ hash: decoded.hash });
        }

        if (foundUser) {
            const { scheduled_for_notification_clear, ...data } = foundUser.toObject();
            return sendSuccessResponse(res, data);
        }

        // check if the token is from google or not

        const userInfo = await googleService.getUserInfo(`Bearer ${req.body.token}`);

        if (!userInfo) throw new UnauthorizedException();

        const hash = getHash(userInfo.email);

        foundUser = await userService.findOne({ google_hash: hash });
        if (foundUser) {
            const { scheduled_for_notification_clear, ...data } = foundUser.toObject();
            return sendSuccessResponse(res, data);
        }

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
