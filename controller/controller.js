import OpenAIApiCall from "../openai/OpenAIApi.js";
import { createCollection } from "../db/CreateNewCollection.js";

let chatHistory = [];

export const query = async (req, res) => {
    try {
        if (!req.body.query || req.body.query.trim() === "") {
            return res
                .status(400)
                .json({ message: "Please include a valid query." });
        }

        chatHistory.push({ role: "user", content: req.body.query.toString() });

        const response = await OpenAIApiCall(chatHistory);

        chatHistory.push(response);

        res.status(200).json({ message: response.content });
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
        await createCollection(ragbot);

        res.status(200).json({ message: "RAG Bot created successfully." });
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};
