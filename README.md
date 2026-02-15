<br />
<div align="center">
  <a href="https://buildabot.tarifmohammad.com">
    <img src="assets/Chat_Bot_Icon.svg" alt="Logo" width="240" height="240">
  </a>
</div>

# Build A Bot – Backend API

Build A Bot is a Retrieval-Augmented Generation (RAG) chatbot builder that allows users to create, customize, and manage AI chatbots powered by their own data sources (PDFs and websites).

This repository contains the REST API responsible for bot configuration, data ingestion, embedding storage, and retrieval orchestration.

---

## 🚀 Overview

The backend enables users to:

- Create customizable RAG bots
- Upload PDFs and ingest website content
- Store vector embeddings in AstraDB
- Perform similarity search for contextual retrieval
- Query bots using a retrieval + generation pipeline
- Manage multiple bots with distinct behavioral configurations

---

## 🏗 Architecture Overview

Build A Bot follows a standard RAG architecture:

1. User uploads PDFs or provides URLs
2. Content is parsed and chunked
3. Text is embedded
4. Embeddings stored in AstraDB (vector database)
5. User query is embedded
6. Relevant chunks retrieved via vector similarity search
7. Retrieved context injected into LLM prompt
8. GPT generates final response

This design separates knowledge retrieval from language generation, improving accuracy and contextual relevance.

---

## 🏗 Architecture Diagram

User<br>
  ↓<br>
React Frontend<br>
  ↓ (REST API)<br>
Express Server (Node.js)<br>
  ↓<br>
Bot Configuration Logic<br>
  ↓<br>
Content Ingestion Pipeline<br>
  ├── PDF Parsing<br>
  ├── Web Scraping<br>
  ├── Text Chunking<br>
  └── Embedding Generation<br>
          ↓<br>
      AstraDB (Vector Storage)<br>
<br>
Query Flow:<br>
User Query<br>
  ↓<br>
Embed Query<br>
  ↓<br>
Vector Similarity Search (AstraDB)<br>
  ↓<br>
Context Injection<br>
  ↓<br>
LLM (GPT-4o-mini)<br>
  ↓<br>
Response<br>

---

## 🧭 Routes

#### GET:

<br/>

-   To get all of the RAG bot collections by their name
-   The Return will be an array of all the RAG bot collection names

```sh
    https://rag-chat-bot-api.onrender.com/api/getAllRAGBotCollectionsByName
```

<br/>
<br/>

-   To get all the RAG bots with the info the user added, like behavior and tone
-   The Return will be an array of all the RAG bot collection and their attributes

```sh
    https://rag-chat-bot-api.onrender.com/api/getAllRAGBotsInfo
```

<br/>
<br/>

-   Used to reset the chat history when switching between RAG bots

```sh
    https://rag-chat-bot-api.onrender.com/api/resetChatHistory
```

<br/>
<br/>

#### POST:

-   To make a query to a specific bot
-   The query, along with a collection name, is needed

```sh
    https://rag-chat-bot-api.onrender.com/api/query
```

<br/>
<br/>

-   Normal query to ChatGPT without the RAG aspects

```sh
    https://rag-chat-bot-api.onrender.com/api/queryNoRAG
```

<br/>
<br/>

-   To build a bot and add some initial data
-   Needs to be sent as form data, add files with "pdf" and add the JSON Bot object with "json."
-   The structure for the object is down below

```sh
    https://rag-chat-bot-api.onrender.com/api/createRAGBot
```

<br/>
<br/>

-   To get all the info of a given collection need the collection name
-   The return is the Bot object, but with a "files" attribute too, for all the files
-   Structure:
    <br/>

```sh
{
    "collectionName": ""
}
```

```sh
    https://rag-chat-bot-api.onrender.com/api/getRAGBotInfoByCollectionName
```

<br/>
<br/>

#### PUT:

-   To add more data to a given bot beyond the initial seed data
-   The Return will be the success of the operation
-   Needs to be sent as form data, add files with "pdf" and add the JSON Bot object with "json."
-   Structure:
    <br/>

```sh
{
    "collectionName": ""
    "links": [""]
}
```

```sh
    https://rag-chat-bot-api.onrender.com/api/addDataToRAGBot
```

<br/>
<br/>

-   To edit the attributes of an existing Bot
-   The Return will be the success of the operation
-   Structure:
    <br/>

```sh
{
    "collectionName": "",
    "specialization" : "",
    "tone" : "",
    "audience" : "",
    "unknown" : "",
    "behavior" : ""
}
```

```sh
    https://rag-chat-bot-api.onrender.com/api/editRAGBot
```

<br/>
<br/>

#### DELETE:

-   To delete a RAG bot from the DB, it deletes the attributes and the saved data
-   The Return will be whether the job succeeded or not

```sh
    https://rag-chat-bot-api.onrender.com/api/deleteRAGBot
```

<br/>

<br/>
<br/>
BOT OBJECT STRUCTURE:
<br/>
<br/>

```sh
{
    "collectionName": "",
    "specialization": "",
    "tone": "",
    "audience": "",
    "unknown": "",
    "behavior": "",
    "links": [""]
}
```

---

## 🛠 Tech Stack

- Node.js
- Express.js
- AstraDB (vector database)
- OpenAI GPT API (gpt-4o-mini)
- PDF parsing
- Web scraping utilities
- Middleware for request handling

---

## 🔐 Bot Customization Model

Each bot includes configurable attributes:

- Specialization
- Tone
- Audience
- Unknown handling behavior
- Response behavior rules

These attributes are injected into the system prompt during generation.

---

## 📦 Key API Capabilities

- Create RAG bot
- Add additional data to existing bot
- Query with RAG
- Query without RAG
- Edit bot attributes
- Delete bot and associated data

---

## ⚖️ Design Decisions & Tradeoffs

**Why AstraDB?**
- Native vector search support
- Simplified embedding storage
- Managed infrastructure

**Tradeoffs**
- Write-heavy ingestion requires careful chunking strategy
- Retrieval quality depends on embedding consistency
- Single-instance deployment limits horizontal scaling

Future scaling improvements could include:
- Caching frequently queried embeddings
- Distributed rate limiting
- Horizontal API scaling

---

## 🌐 Deployment

- Hosted API: Railway
- Database: AstraDB (managed)

---

## 📬 Contact 

Tarif Mohammad - [@GitHub](https://github.com/Tarif24) - [@Linkedin](https://www.linkedin.com/in/tarif-mohammad/) - Tarif24@hotmail.com

Frontend Link: [https://github.com/Tarif24/Build_A_Bot_Frontend](https://github.com/Tarif24/Build_A_Bot_Frontend) </br>
Live Link: [https://buildabot.tarifmohammad.com/][Live-Demo]


[product-screenshot]: assets/readme_image.png
[Live-Demo]: https://buildabot.tarifmohammad.com/
