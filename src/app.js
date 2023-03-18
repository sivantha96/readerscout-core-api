require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { Database } = require("./config/mongo.config");

const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");
const watchlistRoutes = require("./routes/watchlist.routes");
const userRoutes = require("./routes/user.routes");

const errorHandler = require("./middleware/error-handler.middleware");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error("MONGO_URL not specified in environment");
    process.exit(1);
}

const database = new Database({
    mongoUrl,
    onStartConnection: () => {},
    onConnectionSuccess: () => console.info(`Successfully connected to the database`),
    onConnectionError: (error) => console.error("Could not connect to the database at", error),
    onConnectionRetry: () => console.info("Retrying to connect to the database"),
});

const app = express();

// cors
app.use(cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// custom middleware
app.use(async (req, res, next) => {
    await database.connect();
    next();
});

database.connect();

// routes
app.use("/", baseRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/users", userRoutes);

// fallback
app.use("*", (req, res, next) => {
    const error = new Error("Endpoint Not found");
    error.status = 404;
    next(error);
});

app.use(errorHandler);

module.exports = app;
