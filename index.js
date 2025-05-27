import express from "express";
import dotenv from "dotenv";
import route from "./routes/routes.js";
import { createRequire } from "module";

// Init and config setting up express app and dotenv
const require = createRequire(import.meta.url);
const app = express();
const cors = require("cors");
dotenv.config();

// Setting up express middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

// Setting up express routes sets up a route middleware that will pass any request beginning with /api to the route file and the route file will handle the request
app.use("/api", route);
