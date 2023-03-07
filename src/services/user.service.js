const { default: userModel } = require("../models/user.model");
const { CommonService } = require("./common.service");

class UserService extends CommonService {
    constructor() {
        super(userModel);
    }
}

exports.userService = new UserService();
