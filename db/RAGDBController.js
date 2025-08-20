import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from "dotenv";

dotenv.config();

let SimilarityMetric = "cosine" | "dot_product" | "euclidean";

// All variables needed to connect to Astra DB and OpenAI API
const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
const ASTRA_DB_ENDPOINT = process.env.ASTRA_DB_ENDPOINT;
const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create an instance of the OpenAI class with the API key
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

// Connect to Astra DB then the database
const astraClient = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = astraClient.db(ASTRA_DB_ENDPOINT, {
    namespace: ASTRA_DB_NAMESPACE,
});

// Initializing a chuck splitter to split the text into smaller chunks the unit of the numbers are characters
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

    // Create a collection in the database if it doesn't exist
    if (!collectionList.includes(collectionName)) {
        await db.createCollection(collectionName, {
            vector: { dimension: 1536, metric: SimilarityMetric },
        });
    }
};

// goes through each link calls the scrape function then uses the text splitter to split the text into smaller chunks then for each chuck it creates an embedding using the OpenAI API and inserts it into the collection
const loadLinkData = async (collectionName, links) => {
    const collection = await db.collection(collectionName);

    for await (const url of links) {
        console.log("SCRAPING URL: ", url);
        // the content will contain all the text from the page
        const content = await scrapePage(url);
        // will split the content into predefined chunks using the text splitter
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

    console.log("ALL LINKS LOADED TO DB SUCCESSFULLY");
};

const loadPDFData = async (collectionName, files) => {
    const collection = await db.collection(collectionName);

    for await (const file of files) {
        console.log("LOADING FILE: ", file.filename);
        // will split the content into predefined chunks using the text splitter
        const chunks = await splitter.splitText(file.text);
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
        console.log("ALL DATA LOADED TO DB FOR FILE: ", file.filename);
    }

    console.log("ALL FILES LOADED TO DB SUCCESSFULLY");
};

// Scrapes the page using puppeteer and returns the text content of the page
const scrapePage = async (url) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true, // Runs the browser without a GUI
            //executablePath: "/usr/bin/chromium",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
        gotoOptions: {
            waitUntil: "domcontentloaded",
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML); // gets all the html content inside the body tag
            await browser.close(); // closes the browser after scraping to not waste resources
            return result;
        },
    });

    // gets the raw html using .scrape() then removes all the html tags using regex
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

// Creates a new collection in the database and loads sample data into it
export const newCollection = async (collectionName, ragData, files) => {
    try {
        await createCollection(collectionName);
        await loadLinkData(collectionName, ragData);
        await loadPDFData(collectionName, files);
    } catch (error) {
        console.error("Error creating collection or loading data:", error);
    }
};

// adds additional data to an existing collection
export const addDataToCollection = async (collectionName, links, files) => {
    try {
        // Check if the collection exists
        if (!(await db.collection(collectionName))) {
            console.error("Collection does not exist:", collectionName);
            return;
        }
        await loadLinkData(collectionName, links);
        await loadPDFData(collectionName, files);
    } catch (error) {
        console.error("Error loading data:", error);
    }
};

// deletes a collection from the database
export const deleteRagBotCollection = async (collectionName) => {
    try {
        const deletedCollectionRes = await db.dropCollection(collectionName);
    } catch (error) {
        console.error("Error deleting collection:", error);
    }
};

// checks if the link is valid by trying to scrape it using puppeteer
export const isLinkValid = async (url) => {
    try {
        const loader = new PuppeteerWebBaseLoader(url, {
            launchOptions: {
                headless: true,
                //executablePath: "/usr/bin/chromium",
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            },
            gotoOptions: {
                waitUntil: "domcontentloaded",
            },
        });

        // attempt to scrape the page to check if it's accessible
        await loader.scrape();
        return true;
    } catch (error) {
        console.error(`Invalid link: ${url}`, error.message);
        return false;
    }
};
