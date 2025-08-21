<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Tarif24/Job_Listing_Website_React">
    <img src="assets/Chat_Bot_Icon.svg" alt="Logo" width="240" height="240">
  </a>

  <h3 align="center">Build A Bot API</h3>

  <p align="center">
    A Rest API for my site build a bot which holds handles saving and deleting rag information
    <br />
    <br />
    ALL LIVE LINKS ARE TO THE BUILD A BOT WEBSITE WHERE THE API IS USED
    <br />
    <br />
    <br />
    <a href="https://buildabot.tarifmohammad.com/">View Demo</a>
    &middot;
    <a href="https://github.com/Tarif24/Build_A_Bot_Backend/issues/new">Report Bug</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#hosted-with">Hosted With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#routes">Routes</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Screen Shot][product-screenshot]][Live-Demo]

This project is a website where the user can build their own RAG bot using chatgpt gpt-4o-mini as the base and then either upload websites or PDF files to give the chat bot more context it also gives the user a variety of options to customize the bots behavior and responses the their liking

About The Building Process:

Building the backend for Build A Bot was not the greatest challenge of this project while building I did run into issues with integrating different packages some because of a lack of understanding and some because of version issues later were all solved with some time. The greatest hurdle I faced was project/file management and writing future proof code although the code part could though of as just a part of programming i put it in with project management because if i had a clear picture i could have seen a lot of the issues to come which would have saved me hours in rewriting the core code to fit something that i should have already have in mind. The next part tied to this hurdle was file management, I realized as the project grew it become more difficult to traverse files and find parts of the code that I needed easily also some files were just getting too long and out of hand. This caused me to take a day and rework the file structure to where it was more traversable and also split up files that were getting too long into more distinct roles. Overall the backend portion of this website has taught me not only a lot in a programming sense but also a lot in the development process as a whole.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

These are all of the tools used for this project

-   Node.JS
-   Express.JS
-   AstraDB
-   ChatGPT gpt-4o-mini API
-   Claude (Integrated claude into my development flow to improve efficiency and see different ways claude approached the problem which helped me start my train of thought)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Hosted With

These are all of the hosting services I used

-   Render: For the Node and Express application (Free)
-   AstraDB: For the database (Free)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This API allows you to save rag bot preferences and the pairing RAG data to a Astra database best to copy the repo and integrate with your own DB and version of chatgpt

### Prerequisites

-   No prerequisites at this time

### Routes

<br/>

-   To get all the jobs that are available the structure of a job will be down below
-   The Return will be an array of all the jobs

```sh
    https://job-listing-api-84p2.onrender.com/api/job/getAllJobs
```

<br/>
<br/>

-   To get a specific job from the list the ID is needed the structure of the job will be down below
-   The Return will be the specific job that has that ID

```sh
https://job-listing-api-84p2.onrender.com/api/job/:ID
```

<br/>
<br/>

-   To create a job a job object is required and the structure will be down below
-   The Return will be the job that was just created

```sh
https://job-listing-api-84p2.onrender.com/api/job/create
```

<br/>
<br/>

-   To update a job a job object is required and the structure will be down below and a job id is required
-   The Return will be the job that was just updated

```sh
https://job-listing-api-84p2.onrender.com/api/job/update/:ID
```

<br/>
<br/>

-   To Delete a job a job ID is required
-   The Return will be a confirmation message

```sh
    https://job-listing-api-84p2.onrender.com/api/job/delete/:ID
```

<br/>
<br/>
<br/>
JOB OBJECT STRUCTURE:
<br/>
<br/>

```sh
{
      "title": "",
      "type": "",
      "description": "",
      "location": "",
      "salary": "",
      "company": {
        "name": "",
        "description": "",
        "contactEmail": "",
        "contactPhone": ""
      }
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

The usage for this API would be if you ever need to create rag bots

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Tarif Mohammad - [@GitHub](https://github.com/Tarif24) - [@Linkedin](https://www.linkedin.com/in/tarif-mohammad/) - Tarif24@hotmail.com

Project Link: [https://github.com/Tarif24/Build_A_Bot_Backend](https://github.com/Tarif24/Build_A_Bot_Backend)

Live Link: [https://buildabot.tarifmohammad.com/][Live-Demo]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

This is a list of recourses that i found helpful and would like to give credit too

-   [Node.JS Documentation](https://nodejs.org/docs/latest/api/)
-   [Express Documentation](https://expressjs.com/)
-   [AstraDB Documentation](https://docs.datastax.com/en/astra-db-classic/index.html)
-   [Puppeteer Documentation](https://pptr.dev/)
-   [Langchain Documentation](https://python.langchain.com/docs/introduction/)
-   [Patch-Package Documentation](https://www.npmjs.com/package/patch-package)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: assets/readme_image.png
[Live-Demo]: https://buildabot.tarifmohammad.com/
