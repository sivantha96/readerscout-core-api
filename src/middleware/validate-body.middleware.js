const Ajv = require("ajv");
const AjvErrors = require("ajv-errors");
const AjvFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
AjvErrors(ajv);
AjvFormats(ajv);

const env = process.env.ENVIRONMENT;

module.exports = (schema) => (req, res, next) => {
    const validate = ajv.compile(schema);

    if (validate({ ...req.body })) {
        return next();
    }

    const { errors } = validate;

    const message =
        errors && errors.length > 0 && errors[0].message ? errors[0].message : "Bad Request";

    return res.status(400).json({
        success: false,
        message,
        data: env !== "PROD" ? errors : undefined,
    });
};
