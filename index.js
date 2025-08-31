import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import route from "./routes/routes.js";
import { createRequire } from "module";

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
