import {
    createCollection,
    deleteRagBot,
    addLinksToRagBot,
} from "./RAGDBListController.js";
import {
    newCollection,
    deleteRagBotCollection,
    addDataToCollection,
    isLinkValid,
} from "./RAGDBController.js";
import e from "express";

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

    for (const link of validLinks) {
        const doesExist = await isLinkValid(link);
        if (!doesExist) {
            validLinks.splice(validLinks.indexOf(link), 1);
            console.log("Link is not valid:", link);
        }
    }

    await addDataToCollection(collectionName, validLinks);

    return validLinks;
};

export const deleteExistingRagBot = async (collectionName) => {
    await deleteRagBot(collectionName);
    await deleteRagBotCollection(collectionName);
};
