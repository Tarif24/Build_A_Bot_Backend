import express from "express";
import {
    query,
    createRAGBot,
    getAllRAGBotCollectionsByName,
    getAllRAGBotsInfo,
    deleteRAGBot,
} from "../controller/controller.js";

const route = express.Router();

route.get("/getAllRAGBotCollectionsByName", getAllRAGBotCollectionsByName);
route.get("/getAllRAGBotsInfo", getAllRAGBotsInfo);

route.post("/query", query);
route.post("/createragbot", createRAGBot);

route.delete("/deleteRAGBot", deleteRAGBot);

export default route;
