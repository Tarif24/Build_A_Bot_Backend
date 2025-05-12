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

export const createRagBot = async (ragbot) => {
    // creates a new RAG bot using the information provided in the ragbot object
    await createCollection(ragbot);
    // creates a new collection in the database with the name of the ragbot to store all the context
    await newCollection(ragbot.collectionName, ragbot.links);
};

export const addDataToRagBot = async (collectionName, links) => {
    // checks if any of the links are already in the collection if they are it will remove them from the list of links to add
    const validLinks = await addLinksToRagBot(collectionName, links);
    console.log("Valid links to add:", validLinks);

    if (validLinks.length === 0) {
        console.log("No new links to add.");
        return validLinks;
    }

    // goes through the list of links and sees if it is a valid link to an actual page if not it will remove it from the list of links to add
    for (const link of validLinks) {
        const doesExist = await isLinkValid(link);
        if (!doesExist) {
            validLinks.splice(validLinks.indexOf(link), 1);
            console.log("Link is not valid:", link);
        }
    }

    // sends the valid links to be scrapped and added to the collection
    await addDataToCollection(collectionName, validLinks);

    return validLinks;
};

export const deleteExistingRagBot = async (collectionName) => {
    // deletes the collection from the list of RAG bots
    await deleteRagBot(collectionName);
    // deletes the collecction that hold all the context for the RAG bot
    await deleteRagBotCollection(collectionName);
};
