import express from "express";
import { query, createRAGBot } from "../controller/controller.js";

const route = express.Router();

route.post("/query", query);
route.post("/createragbot", createRAGBot);

export default route;
