import OpenAIApiCallRAG, { OpenAIApiCallNoRAG } from "../openai/OpenAIApi.js";
import {
    createRagBot,
    deleteExistingRagBot,
    addDataToRagBot,
} from "../db/MainDBController.js";
import {
    getAllRagBotsCollectionsByName,
    getAllRagBotsInfo,
    getRagBotInfoByCollectionName,
    editRagBot,
    doesRagBotExist,
} from "../db/RAGDBListController.js";

let chatHistory = [];
let chatHistoryNoRAG = [];

export const query = async (req, res) => {
    try {
        if (
            !req.body.query ||
            req.body.query.trim() === "" ||
            !req.body.collectionName
        ) {
            return res
                .status(400)
                .json({ message: "Please include a valid query." });
        }

        chatHistory.push({ role: "user", content: req.body.query.toString() });

        const collectionName = req.body.collectionName;

        const ragbot = await getRagBotInfoByCollectionName(collectionName);

        const response = await OpenAIApiCallRAG(chatHistory, ragbot);

        chatHistory.push(response);

        res.status(200).json({ message: response.content });
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

export const queryNoRAG = async (req, res) => {
    try {
        if (!req.body.query || req.body.query.trim() === "") {
            return res
                .status(400)
                .json({ message: "Please include a valid query." });
        }

        chatHistoryNoRAG.push({
            role: "user",
            content: req.body.query.toString(),
        });

        const response = await OpenAIApiCallNoRAG(chatHistoryNoRAG);

        chatHistoryNoRAG.push(response);

        res.status(200).json({ message: response.content });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error,
        });
    }
};

export const resetChatHistory = async (req, res) => {
    try {
        chatHistory = [];
        chatHistoryNoRAG = [];
        res.status(200).json({ message: "Chat history reset successfully." });
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

export const createRAGBot = async (req, res) => {
    try {
        const ragbot = req.body;
        if (
            !ragbot ||
            !ragbot.collectionName ||
            !ragbot.specialization ||
            !ragbot.tone ||
            !ragbot.audience ||
            !ragbot.unknown ||
            !ragbot.behavior ||
            !ragbot.links
        ) {
            return res.status(400).json({
                message: "Please include a valid ragbot.",
            });
        }

        const ragbotList = await getAllRagBotsCollectionsByName();
        if (ragbotList.includes(ragbot.collectionName)) {
            return res.status(400).json({
                message: "RAG Bot with this collection name already exists.",
            });
        }

        await createRagBot(ragbot);

        res.status(200).json({ message: "RAG Bot created successfully." });
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

export const getAllRAGBotCollectionsByName = async (req, res) => {
    try {
        const allRagBotsCollectionsName =
            await getAllRagBotsCollectionsByName();
        res.status(200).json(allRagBotsCollectionsName);
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

export const getAllRAGBotsInfo = async (req, res) => {
    try {
        const allRAGBotsInfo = await getAllRagBotsInfo();
        res.status(200).json(allRAGBotsInfo);
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

export const getRAGBotInfoByCollectionName = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
            });
        }
        const RAGBotInfo = await getRagBotInfoByCollectionName(collectionName);
        res.status(200).json(RAGBotInfo);
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};

export const addDataToRAGBot = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        const links = req.body.links;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
            });
        }
        if (!links || links.length === 0) {
            return res.status(400).json({
                message: "Please include valid data to add.",
            });
        }
        const validLinks = await addDataToRagBot(collectionName, links);
        if (validLinks.length === 0) {
            return res.status(400).json({
                message: "No new links to add.",
                validLinks: validLinks,
            });
        }
        res.status(200).json({
            message: "Data added successfully.",
            validLinks: validLinks,
        });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            validLinks: validLinks,
        });
    }
};

export const editRAGBot = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        const ragbot = req.body;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
            });
        }
        if (
            !ragbot ||
            !ragbot.specialization ||
            !ragbot.tone ||
            !ragbot.audience ||
            !ragbot.unknown ||
            !ragbot.behavior
        ) {
            return res.status(400).json({
                message: "Please include a valid ragbot.",
            });
        }
        const doesExist = await doesRagBotExist(collectionName);
        if (!doesExist) {
            return res.status(400).json({
                message: "RAG Bot with this collection name does not exist.",
            });
        }
        await editRagBot(collectionName, ragbot);
        res.status(200).json({ message: "RAG Bot edited successfully." });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error,
        });
    }
};

export const deleteRAGBot = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
            });
        }
        await deleteExistingRagBot(collectionName);
        res.status(200).json({ message: "RAG Bot deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};
