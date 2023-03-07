exports.sendSuccessResponse = (res, data, status = 200, message = "Success") => {
    res.status(status).json({
        error: false,
        message,
        data,
    });
};
