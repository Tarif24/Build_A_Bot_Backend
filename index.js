import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import route from "./routes/routes.js";
import { createRequire } from "module";
import { DataAPIClient } from "@datastax/astra-db-ts";

// Init and config setting up express app and dotenv
const require = createRequire(import.meta.url);
const app = express();
const cors = require("cors");
dotenv.config();

// Configure multer to store files in memory (no disk saving needed)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Setting up express middleware
app.use(cors());
app.use(express.json());
app.use("/api/addDataToRAGBot", upload.array("pdf", 15));
app.use("/api/createRAGBot", upload.array("pdf", 15));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);

    if (!server) {
        console.log("Server is not running");
        process.exit(1);
    }
    server.close((err) => {
        if (err) {
            console.error("Error during server shutdown:", err);
            process.exit(1);
        }

        console.log("Server closed successfully");

        // Close database connections, cleanup resources, etc.
        // db.close() if you have a database

        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10000);
};

const keepDBAlive = () => {
    // All variables needed to connect to Astra DB
    const ASTRA_LIST_DB_NAMESPACE = process.env.ASTRA_LIST_DB_NAMESPACE;
    const ASTRA_LIST_DB_COLLECTION = process.env.ASTRA_LIST_DB_COLLECTION;
    const ASTRA_LIST_DB_ENDPOINT = process.env.ASTRA_LIST_DB_ENDPOINT;
    const ASTRA_LIST_DB_APPLICATION_TOKEN =
        process.env.ASTRA_LIST_DB_APPLICATION_TOKEN;

    // Connect to Astra DB then the database then the collection
    const astraClient1 = new DataAPIClient(ASTRA_LIST_DB_APPLICATION_TOKEN);
    const db1 = astraClient1.db(ASTRA_LIST_DB_ENDPOINT, {
        namespace: ASTRA_LIST_DB_NAMESPACE,
    });
    const collection1 = db1.collection(ASTRA_LIST_DB_COLLECTION);
    collection1.findOne({
        collectionName: "TEST",
    });
    console.log("LIST DB ACTIVE");

    // All variables needed to connect to Astra DB and OpenAI API
    const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
    const ASTRA_DB_COLLECTION = process.env.ASTRA_DB_COLLECTION;
    const ASTRA_DB_ENDPOINT = process.env.ASTRA_DB_ENDPOINT;
    const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN;

    // Connect to Astra DB then the database
    const astraClient2 = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
    const db2 = astraClient2.db(ASTRA_DB_ENDPOINT, {
        namespace: ASTRA_DB_NAMESPACE,
    });
    const collection2 = db2.collection(ASTRA_DB_COLLECTION);
    collection2.findOne({
        collectionName: "TEST",
    });

    console.log("DATA DB ACTIVE");
};

// Runs every 12 hours to keep DB active
setInterval(keepDBAlive, 60000 * 60 * 12);

// Handle shutdown signals
//process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGTERM", () => {
    console.log("SIGTERM handler called");
    gracefulShutdown("SIGTERM");
});
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    gracefulShutdown("UNHANDLED_REJECTION");
});

// Setting up express routes sets up a route middleware that will pass any request beginning with /api to the route file and the route file will handle the request
app.use("/api", route);
