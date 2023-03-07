const { UnauthorizedException } = require("../common/exceptions");
const { convertKitService } = require("../services/convert-kit.service");
const { googleService } = require("../services/google.service");
const { userService } = require("../services/user.service");
const { wordpressService } = require("../services/wordpress.service");
const { getHash } = require("../utils");

exports.checkGoogleAuth = ({ allowAuthFromUserId }) => {
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
                requestUser = await userService.create({ hash });

                await convertKitService.subscribeToNewsLetter(userInfo.email);

                // push the user to the wordpress side
                await wordpressService.createUser(hash);
            }

            req.user = requestUser;

            next();
        } catch (error) {
            next(error);
        }
    };
};
