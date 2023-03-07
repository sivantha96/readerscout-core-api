const ApplicationException = require("./application.exception");

class UnauthorizedException extends ApplicationException {
    constructor(message) {
        super(message || "Unauthorized", 401);
    }
}

module.exports = UnauthorizedException;
