const serverless = require("serverless-http");
const app = require("./src/app");

const port = process.env.PORT || 8000;
const env = process.env.ENVIRONMENT;

if (env === "PROD" || env === "DEV") {
    exports.handler = serverless(app);
} else {
    app.listen(port, () => {
        console.log(`ReaderScout Core Server is listening on port ${port}`);
    });
}
