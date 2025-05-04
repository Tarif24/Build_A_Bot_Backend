import {
    createCollection,
    deleteRagBot,
    addLinksToRagBot,
} from "./RAGDBListController.js";
import {
    newCollection,
    deleteRagBotCollection,
    addDataToCollection,
} from "./RAGDBController.js";

export const createRagBot = async (ragbot) => {
    await createCollection(ragbot);
    await newCollection(ragbot.collectionName, ragbot.links);
};

export const addDataToRagBot = async (collectionName, links) => {
    const validLinks = await addLinksToRagBot(collectionName, links);
    console.log("Valid links to add:", validLinks);

    if (validLinks.length === 0) {
        console.log("No new links to add.");
        return validLinks;
    }
    await addDataToCollection(collectionName, validLinks);

    return validLinks;
};

export const deleteExistingRagBot = async (collectionName) => {
    await deleteRagBot(collectionName);
    await deleteRagBotCollection(collectionName);
};
