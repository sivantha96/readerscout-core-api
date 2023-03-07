const NotFoundException = require("./not-found.exception");
const UnprocessableEntityException = require("./unprocessable-entity.exception");
const InternalServerErrorException = require("./internal-server-error.exception");
const UnauthorizedException = require("./unauthorized.exception");
const BadRequestException = require("./bad-request.exception");

module.exports = {
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
    UnauthorizedException,
    BadRequestException,
};
