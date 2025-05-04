import express from "express";
import {
    query,
    queryNoRAG,
    resetChatHistory,
    createRAGBot,
    getAllRAGBotCollectionsByName,
    getAllRAGBotsInfo,
    addDataToRAGBot,
    deleteRAGBot,
} from "../controller/controller.js";

const route = express.Router();

route.get("/getAllRAGBotCollectionsByName", getAllRAGBotCollectionsByName);
route.get("/getAllRAGBotsInfo", getAllRAGBotsInfo);
route.get("/resetChatHistory", resetChatHistory);

route.post("/query", query);
route.post("/queryNoRAG", queryNoRAG);
route.post("/createRAGBot", createRAGBot);

route.put("/addDataToRAGBot", addDataToRAGBot);

route.delete("/deleteRAGBot", deleteRAGBot);

export default route;
