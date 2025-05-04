import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// All varaiables needed to connect to Astra DB and OpenAI API
const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
const ASTRA_DB_COLLECTION = process.env.ASTRA_DB_COLLECTION;
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

// Creates a template of the message sent to OpenAI API with context from the database and the users question
const CreateMessageTemplate = async (userMessage, ragbot) => {
    try {
        let docContext = "";

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: userMessage,
            encoding_format: "float",
        });

        try {
            const collection = await db.collection(ragbot.collectionName);

            const contextVectors = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10,
            });

            const contextVectorsArray = await contextVectors.toArray();
            const context = contextVectorsArray.map((doc) => doc.text);

            docContext = JSON.stringify(context);
        } catch (error) {
            console.error("Error querying the database:", error);
            docContext = "";
        }

        const template = {
            role: "system",
            content: `
            You are an AI assistant who knows everything about ${ragbot.specialization}.Use the below context to augment what you know about ${ragbot.specialization}.

            Your tone is ${ragbot.tone}. 
            
            Your audience is ${ragbot.audience}. 
            
            If the context doesn't include the information you need to answer then you should ${ragbot.unknown}. 
            
            Your behavior is ${ragbot.behavior}. 

            Format responses using markdown where applicable and don't return images.
            
            ----------------------------
            START OF CONTEXT
            ${docContext}
            END OF CONTEXT
            ----------------------------
            QUESTIION: ${userMessage}
            ----------------------------`,
        };

        return template;
    } catch (error) {
        console.error("Error creating message:", error);
    }
};

// Function is called with the chat history and returns the response from OpenAI
const OpenAIApiCallRAG = async (chatHistory, ragbot) => {
    const lastMessage = chatHistory[chatHistory.length - 1].content;

    const messageTemplate = await CreateMessageTemplate(lastMessage, ragbot);

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [messageTemplate, ...chatHistory],
        n: 1,
    });

    return response.choices[0].message;
};

export const OpenAIApiCallNoRAG = async (chatHistory) => {
    const lastMessage = chatHistory[chatHistory.length - 1];

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [lastMessage, ...chatHistory],
        n: 1,
    });

    return response.choices[0].message;
};

export default OpenAIApiCallRAG;
