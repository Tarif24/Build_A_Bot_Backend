import express from "express";
import { query } from "../controller/controller.js";

const route = express.Router();

route.post("/query", query);

export default route;
