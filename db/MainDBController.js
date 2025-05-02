import { createCollection, deleteRagBot } from "./RAGDBListController.js";
import { newCollection, deleteRagBotCollection } from "./RAGDBController.js";

export const createNewRAGBot = async (ragbot) => {
    await createCollection(ragbot);
    await newCollection(ragbot.collectionName, ragbot.links);
};

export const deleteExistingRagBot = async (collectionName) => {
    await deleteRagBot(collectionName);
    await deleteRagBotCollection(collectionName);
};
