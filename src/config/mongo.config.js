const { connect, connection } = require("mongoose");

exports.Database = class Database {
    options;
    mongoConnectionOptions = {};

    isConnected = false;
    isConnectedBefore = false;
    shouldCloseConnection = false;

    retryDelayMs = 2000;
    connectionTimeout;

    constructor(options) {
        this.options = options;
        connection.on("error", this.onError);
        connection.on("connected", this.onConnected);
        connection.on("disconnected", this.onDisconnected);
        connection.on("reconnected", this.onReconnected);

        if (options.retryDelayMs) {
            this.retryDelayMs = options.retryDelayMs;
        }
    }

    // connect to the database
    connect() {
        return new Promise((resolve) => {
            this.startConnection();

            setInterval(() => {
                if (this.isConnected) {
                    resolve();
                }
            }, 1000);
        });
    }

    // close mongo connection
    close(onClosed, force) {
        this.isConnected = false;
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
        }
        this.shouldCloseConnection = true;
        connection.close(force, onClosed);
    }

    // start mongo connection
    startConnection = () => {
        if (this.options.onStartConnection) {
            this.options.onStartConnection(this.options.mongoUrl);
        }
        connect(this.options.mongoUrl, this.mongoConnectionOptions).catch(() => {
            // ignore
        });
    };

    // handler called when mongo connection is established
    onConnected = () => {
        this.isConnected = true;
        this.isConnectedBefore = true;
        this.options.onConnectionSuccess?.(this.options.mongoUrl);
    };

    // handler called when mongo gets re-connected to the database
    onReconnected = () => {
        this.isConnected = true;
        this.options.onConnectionSuccess?.(this.options.mongoUrl);
    };

    // handler called for mongo connection errors
    onError = (error) => {
        if (this.options.onConnectionError) {
            this.options.onConnectionError(error, this.options.mongoUrl);
        }
    };

    // handler called when mongo connection is lost
    onDisconnected = () => {
        this.isConnected = false;
        if (!this.isConnectedBefore && !this.shouldCloseConnection) {
            this.connectionTimeout = setTimeout(() => {
                this.startConnection();
                this.connectionTimeout && clearTimeout(this.connectionTimeout);
            }, this.retryDelayMs);
            if (this.options.onConnectionRetry) {
                this.options.onConnectionRetry(this.options.mongoUrl);
            }
        }
    };
};
