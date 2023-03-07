const ApplicationException = require("./application.exception");

class NotFoundException extends ApplicationException {
    constructor(message) {
        super(message || "Not found", 404);
    }
}

module.exports = NotFoundException;
