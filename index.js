import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import route from "./routes/routes.js";
import { createRequire } from "module";

// Init and config seting up express app and dotenc
const require = createRequire(import.meta.url);
const app = express();
const cors = require("cors");
dotenv.config();

// Setting up express app and middleware
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

app.use("/api", route);
