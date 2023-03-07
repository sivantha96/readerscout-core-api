const errorHandler = (error, req, res, next) => {
    if (error.status === 500) {
        console.log("INTERNAL SERVER ERROR", error);
    }

    res.status(error.status || 500).json({
        error: true,
        message: error.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
