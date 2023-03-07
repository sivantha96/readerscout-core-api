require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { Database } = require("./config/mongo.config");
const baseRoutes = require("./routes/base.routes");
const errorHandler = require("./middleware/error-handler.middleware");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error("MONGO_URL not specified in environment");
    process.exit(1);
}

const database = new Database({
    mongoUrl,
    onStartConnection: () => console.info("Connecting to the database"),
    onConnectionSuccess: () => console.info(`Successfully connected to the database`),
    onConnectionError: (error) => console.error("Could not connect to the database at", error),
    onConnectionRetry: () => console.info("Retrying to connect to the database"),
});

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// cors
app.options("*", cors());

// custom middleware
app.use(async (req, res, next) => {
    await database.connect();
    next();
});

database.connect();

// routes
app.use("/", baseRoutes);

// fallback
app.use("*", (req, res, next) => {
    const error = new Error("Endpoint Not found");
    error.status = 404;
    next(error);
});

app.use(errorHandler);

module.exports = app;
