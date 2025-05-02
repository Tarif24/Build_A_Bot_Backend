import { createCollection } from "./RAGDBListController.js";
import { newCollection } from "./RAGDBController.js";

export const createNewRAGBot = async (ragbot) => {
    await createCollection(ragbot);
    await newCollection(ragbot.collectionName, ragbot.links);
};
