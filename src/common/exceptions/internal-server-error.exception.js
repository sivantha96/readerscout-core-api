const ApplicationException = require("./application.exception");

class InternalServerErrorException extends ApplicationException {
    constructor(message) {
        super(message || "Internal Server Error", 500);
    }
}

module.exports = InternalServerErrorException;
