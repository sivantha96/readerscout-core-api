const { UnauthorizedException } = require("../common/exceptions");
const { PROVIDERS } = require("../constants");
const { convertKitService } = require("../services/convert-kit.service");
const { googleService } = require("../services/google.service");
const { userService } = require("../services/user.service");
const { wordpressService } = require("../services/wordpress.service");
const { getHash } = require("../utils");
const jwt = require("jsonwebtoken");

exports.checkGoogleAuth = ({ allowAuthFromUserId, allow }) => {
    return async (req, res, next) => {
        try {
            let hash;
            let userInfo;

            if (allowAuthFromUserId) {
                const { userId } = req.query;
                hash = userId;
            }

            if (!hash) {
                userInfo = await googleService.getUserInfo(req.headers.authorization);

                if (!userInfo) throw new UnauthorizedException();

                hash = getHash(userInfo.email);
            }

            // get the request user
            let requestUser = await userService.findOne({ hash });

            if (!requestUser) {
                // should not create users when using the userId
                if (req.query.userId) throw new UnauthorizedException();

                // user does not exist
                // not using the userId but using the google auth
                // therefore create the user
                requestUser = await userService.create({
                    hash,
                    provider: PROVIDERS.GOOGLE,
                });

                await convertKitService.subscribeToNewsLetter(userInfo.email);

                // push the user to the wordpress side
                await wordpressService.createUser(hash);
            }

            // allow only if the provider is google
            if (requestUser.provider !== PROVIDERS.GOOGLE) {
                throw new UnauthorizedException();
            }

            req.user = requestUser;

            next();
        } catch (error) {
            next(error);
        }
    };
};

exports.checkAuth = () => {
    return async (req, res, next) => {
        try {
            if (!req.headers.provider) {
                throw new UnauthorizedException("Provider is required");
            }

            // get the request user
            if (!req.headers.authorization) throw new UnauthorizedException();

            let requestUser;
            if (req.headers.provider === PROVIDERS.AMAZON) {
                // if the provider is amazon then the token is coming as a bearer token
                const [, token] = req.headers.authorization.split(" ");

                let decoded;

                try {
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                } catch (error) {
                    throw new UnauthorizedException();
                }

                requestUser = await userService.findOne({ hash: decoded.hash });
            } else {
                const userInfo = await googleService.getUserInfo(req.headers.authorization);

                if (!userInfo) throw new UnauthorizedException();

                const hash = getHash(userInfo.email);

                requestUser = await userService.findOne({ hash });
            }

            if (!requestUser) {
                throw new UnauthorizedException();
            }

            req.user = requestUser;

            next();
        } catch (error) {
            next(error);
        }
    };
};
