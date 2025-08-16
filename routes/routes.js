import express from "express";
import {
    query,
    queryNoRAG,
    resetChatHistory,
    createRAGBot,
    getAllRAGBotCollectionsByName,
    getAllRAGBotsInfo,
    getRAGBotInfoByCollectionName,
    addDataToRAGBot,
    uploadPDF,
    editRAGBot,
    deleteRAGBot,
} from "../controller/controller.js";

// Crete a new express router that will handle all the routes
const route = express.Router();

route.get("/getAllRAGBotCollectionsByName", getAllRAGBotCollectionsByName);
route.get("/getAllRAGBotsInfo", getAllRAGBotsInfo);
route.get("/resetChatHistory", resetChatHistory);

route.post("/query", query);
route.post("/queryNoRAG", queryNoRAG);
route.post("/createRAGBot", createRAGBot);
route.post("/getRAGBotInfoByCollectionName", getRAGBotInfoByCollectionName);

route.put("/addDataToRAGBot", addDataToRAGBot);
route.post("/uploadPDF", uploadPDF);
route.put("/editRAGBot", editRAGBot);

route.delete("/deleteRAGBot", deleteRAGBot);

export default route;
