import { DataAPIClient } from "@datastax/astra-db-ts";
import dotenv from "dotenv";

dotenv.config();

// All varaiables needed to connect to Astra DB
const ASTRA_DB_NAMESPACE = process.env.ASTRA_LIST_DB_NAMESPACE;
const ASTRA_DB_COLLECTION = process.env.ASTRA_LIST_DB_COLLECTION;
const ASTRA_DB_ENDPOINT = process.env.ASTRA_LIST_DB_ENDPOINT;
const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_LIST_DB_APPLICATION_TOKEN;

// Connect to Astra DB then the database then the collection
const astraClient = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = astraClient.db(ASTRA_DB_ENDPOINT, {
    namespace: ASTRA_DB_NAMESPACE,
});
const collection = db.collection(ASTRA_DB_COLLECTION);

const doesLinkExist = async (collectionName, link) => {
    const ragBot = await collection.findOne({
        collectionName: collectionName,
    });

    let doesExist = false;

    ragBot.links.forEach((ragbotLink) => {
        if (ragbotLink === link) {
            doesExist = true;
        }
    });

    return doesExist;
};

export const createCollection = async (ragbot) => {
    await collection.insertOne(ragbot);
};

export const doesRagBotExist = async (collectionName) => {
    const ragBot = await collection.findOne({
        collectionName: collectionName,
    });
    if (ragBot) {
        return true;
    } else {
        return false;
    }
};

export const getRagBotInfoByCollectionName = async (collectionName) => {
    const ragBot = await collection.findOne({
        collectionName: collectionName,
    });

    return ragBot;
};

export const getAllRagBotsInfo = async () => {
    const allRagBots = await collection.find({}).toArray();
    return allRagBots;
};

export const getAllRagBotsCollectionsByName = async () => {
    const allRagBots = await collection.find({}).toArray();
    const allRagBotsCollectionsName = allRagBots.map((ragbot) => {
        return ragbot.collectionName;
    });
    return allRagBotsCollectionsName;
};

export const addLinksToRagBot = async (collectionName, links) => {
    let validLinks = [];

    for (const link of links) {
        const doesExist = await doesLinkExist(collectionName, link);

        console.log("Link: ", link, " doesExist: ", doesExist);

        if (!doesExist) {
            await collection.updateOne(
                { collectionName: collectionName },
                { $push: { links: link } }
            );
            validLinks.push(link);
        } else {
            console.log("Link already exists in the collection.");
        }
    }
    console.log("Valid links to add:", validLinks);
    return validLinks;
};

export const editRagBot = async (collectionName, ragBot) => {
    await collection.updateOne(
        { collectionName: collectionName },
        {
            $set: {
                // Use $set for the other fields as well
                specialization: ragBot.specialization,
                tone: ragBot.tone,
                audience: ragBot.audience,
                unknown: ragBot.unknown,
                behavior: ragBot.behavior,
                links: ragBot.links,
            },
        }
    );
};

export const deleteRagBot = async (collectionName) => {
    const deleteRagBotRes = await collection.deleteOne({
        collectionName: collectionName,
    });
};
