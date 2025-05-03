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

export const createCollection = async (ragbot) => {
    await collection.insertOne(ragbot);
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

export const deleteRagBot = async (collectionName) => {
    const deleteRagBotRes = await collection.deleteOne({
        collectionName: collectionName,
    });
};
