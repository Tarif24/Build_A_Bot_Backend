import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from "dotenv";

dotenv.config();

let SimilarityMetric = "cosine" | "dot_product" | "euclidean";

// All varaiables needed to connect to Astra DB and OpenAI API
const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
const ASTRA_DB_COLLECTION = process.env.ASTRA_DB_COLLECTION;
const ASTRA_DB_ENDPOINT = process.env.ASTRA_DB_ENDPOINT;
const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

// This is a list of URLs that will be scraped to load the data into the database
// const ragData = [
//     "https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship",
// ];

// Connect to Astra DB then the database
const astraClient = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = astraClient.db(ASTRA_DB_ENDPOINT, {
    namespace: ASTRA_DB_NAMESPACE,
});

// Initilizing a chuck splitter to split the text into smaller chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100,
});

// Creating a collection with in astra DB with in my namespace
const createCollection = async (
    collectionName,
    SimilarityMetric = "dot_product"
) => {
    const collectionList = await db.listCollections();

    // Create a collection in the database
    if (!collectionList.includes(collectionName)) {
        await db.createCollection(collectionName, {
            vector: { dimension: 1536, metric: SimilarityMetric },
        });
    }
};

const loadSampleData = async (collectionName, ragData) => {
    const collection = await db.collection(collectionName);

    for await (const url of ragData) {
        console.log("SCRAPING URL: ", url);
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
        console.log("SCRAPING URL: ", url, " DONE");
        for await (const chunk of chunks) {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float",
            });

            const vector = embedding.data[0].embedding;

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk,
            });

            console.log("Inserted:", res);
        }
        console.log("ALL DATA LOADED TO DB FOR URL: ", url);
    }

    console.log("ALL DATA LOADED TO DB SUCCESSFULLY");
};

const scrapePage = async (url) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true,
        },
        gotoOptions: {
            waitUntil: "domcontentloaded",
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML);
            await browser.close();
            return result;
        },
    });

    return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

export const newCollection = async (collectionName, ragData) => {
    try {
        await createCollection(collectionName);
        await loadSampleData(collectionName, ragData);
    } catch (error) {
        console.error("Error creating collection or loading data:", error);
    }
};

export const addDataToCollection = async (collectionName, ragData) => {
    try {
        if (!(await db.collection(collectionName))) {
            console.error("Collection does not exist:", collectionName);
            return;
        }
        await loadSampleData(collectionName, ragData);
    } catch (error) {
        console.error("Error loading data:", error);
    }
};

export const deleteRagBotCollection = async (collectionName) => {
    try {
        const deletedCollectionRes = await db.dropCollection(collectionName);
    } catch (error) {
        console.error("Error deleting collection:", error);
    }
};
