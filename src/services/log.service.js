const { default: logModel } = require("../models/log.model");
const { CommonService } = require("./common.service");

class LogService extends CommonService {
    constructor() {
        super(logModel);
    }
}

exports.logService = new LogService();
