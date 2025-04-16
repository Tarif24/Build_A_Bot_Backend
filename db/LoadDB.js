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
const ragData = [
    //"https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship",
];

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
const createCollection = async (SimilarityMetric = "dot_product") => {
    // Create a collection in the database
    await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: { dimension: 1536, metric: SimilarityMetric },
    });
};

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION);

    for await (const url of ragData) {
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
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
    }

    console.log("Data loaded successfully!");
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

createCollection().then(() => loadSampleData());
