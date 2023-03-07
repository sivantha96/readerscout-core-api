const ApplicationException = require("./application.exception");

class UnprocessableEntityException extends ApplicationException {
    constructor(message) {
        super(message || "Unprocessable Entity", 422);
    }
}

module.exports = UnprocessableEntityException;
