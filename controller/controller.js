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

// used to query the chatbot with the specified RAG collection
export const query = async (req, res) => {
    try {
        if (
            !req.body.query ||
            req.body.query.trim() === "" ||
            !req.body.collectionName
        ) {
            return res.status(400).json({
                message: "Please include a valid query.",
                success: false,
            });
        }

        const doesExist = await doesRagBotExist(req.body.collectionName);
        if (!doesExist) {
            return res
                .status(400)
                .json({ message: "RAG Bot does not exist.", success: false });
        }

        chatHistory.push({ role: "user", content: req.body.query.toString() });

        const collectionName = req.body.collectionName;

        const ragbot = await getRagBotInfoByCollectionName(collectionName);

        const response = await OpenAIApiCallRAG(chatHistory, ragbot);

        chatHistory.push(response);

        res.status(200).json({ message: response.content, success: true });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            error: error,
        });
    }
};

// used to query the chatbot without a RAG collection
export const queryNoRAG = async (req, res) => {
    try {
        if (!req.body.query || req.body.query.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid query.",
                success: false,
            });
        }

        chatHistoryNoRAG.push({
            role: "user",
            content: req.body.query.toString(),
        });

        const response = await OpenAIApiCallNoRAG(chatHistoryNoRAG);

        chatHistoryNoRAG.push(response);

        res.status(200).json({ message: response.content, success: true });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            error: error,
        });
    }
};

// used to reset the chat history
export const resetChatHistory = async (req, res) => {
    try {
        chatHistory = [];
        chatHistoryNoRAG = [];
        res.status(200).json({
            message: "Chat history reset successfully.",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            error: error,
        });
    }
};

// used to create a new RAG bot
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
                success: false,
            });
        }

        const doesExist = await doesRagBotExist(req.body.collectionName);
        if (doesExist) {
            return res
                .status(400)
                .json({ message: "RAG Bot already exists.", success: false });
        }

        await createRagBot(ragbot);

        res.status(200).json({
            message: "RAG Bot created successfully.",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            error: error,
        });
    }
};

export const getAllRAGBotCollectionsByName = async (req, res) => {
    try {
        const allRagBotsCollectionsName =
            await getAllRagBotsCollectionsByName();
        res.status(200).json(allRagBotsCollectionsName);
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error,
        });
    }
};

export const getAllRAGBotsInfo = async (req, res) => {
    try {
        const allRAGBotsInfo = await getAllRagBotsInfo();
        res.status(200).json(allRAGBotsInfo);
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error,
        });
    }
};

export const getRAGBotInfoByCollectionName = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
                success: false,
            });
        }

        const doesExist = await doesRagBotExist(req.body.collectionName);
        if (!doesExist) {
            return res
                .status(400)
                .json({ message: "RAG Bot does not exist.", success: false });
        }

        const RAGBotInfo = await getRagBotInfoByCollectionName(collectionName);
        res.status(200).json({ message: RAGBotInfo, success: false });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            error: error,
        });
    }
};

// used to add data to an existing RAG bot
export const addDataToRAGBot = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        const links = req.body.links;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
                success: false,
            });
        }

        if (!links || links.length === 0) {
            return res.status(400).json({
                message: "Please include valid data to add.",
                success: false,
            });
        }

        const doesExist = await doesRagBotExist(req.body.collectionName);
        if (!doesExist) {
            return res
                .status(400)
                .json({ message: "RAG Bot does not exist.", success: false });
        }

        const validLinks = await addDataToRagBot(collectionName, links);
        if (validLinks.length === 0) {
            return res.status(400).json({
                message: "No new links to add.",
                success: false,
                validLinks: validLinks,
            });
        }
        res.status(200).json({
            message: "Data added successfully.",
            success: true,
            validLinks: validLinks,
        });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            validLinks: validLinks,
            error: error,
        });
    }
};

// used to edit an existing RAG bot
export const editRAGBot = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        const ragbot = req.body;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
                success: false,
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
                success: false,
            });
        }
        const doesExist = await doesRagBotExist(collectionName);
        if (!doesExist) {
            return res.status(400).json({
                message: "RAG Bot with this collection name does not exist.",
                success: false,
            });
        }
        await editRagBot(collectionName, ragbot);
        res.status(200).json({
            message: "RAG Bot edited successfully.",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            error: error,
        });
    }
};

// used to delete an existing RAG bot
export const deleteRAGBot = async (req, res) => {
    try {
        const collectionName = req.body.collectionName;
        if (!collectionName || collectionName.trim() === "") {
            return res.status(400).json({
                message: "Please include a valid collection name.",
                success: false,
            });
        }

        const doesExist = await doesRagBotExist(req.body.collectionName);
        if (!doesExist) {
            return res
                .status(400)
                .json({ message: "RAG Bot does not exist.", success: false });
        }

        await deleteExistingRagBot(collectionName);
        res.status(200).json({
            message: "RAG Bot deleted successfully.",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            success: false,
            error: error,
        });
    }
};
