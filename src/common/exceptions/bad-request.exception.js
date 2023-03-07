const ApplicationException = require("./application.exception");

class UnprocessableEntityException extends ApplicationException {
    constructor(message) {
        super(message || "Bad Request", 400);
    }
}

module.exports = UnprocessableEntityException;
