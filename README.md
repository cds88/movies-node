# NestJS Application Documentation

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Features](#features)
  - [Throttling](#throttling)
  - [Caching](#caching)
  - [Embeddings Module](#embeddings-module)
  - [CQRS Pattern](#cqrs-pattern)
- [Running the Application](#running-the-application)
- [License](#license)

## Introduction
This is a Node **NestJS** api implementing **MongoDB Atlas** vector search on sample dataset which utilize OpenAI’s text-embedding-ada-002 model. It allows to filter data based on provided vector or with help of OpenAI api it can transform a given string into a 1536 length vector.
Various features such as **throttling, caching, embedding generation**, and **CQRS** are implemented for better modularity and separation of concerns.

## Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   yarn  
   ```
3. Set up environment variables (see [Configuration](#configuration)).

## Configuration
This app requires some environment variables to be set. Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongo_uri
MONGO_DB_NAME=your_database_name
MONDO_COLLECTION_NAME=your_collection_name
OPENAI_API_KEY=your_openai_token
PORT=3000
```

## Features

### Throttling
Throttling is implemented using `@nestjs/throttler` to limit request rates and prevent abuse.



### Caching
Caching is implemented using `@nestjs/cache-manager` to improve performance and reduce API calls.


### Embeddings Module
This module generates text embeddings using **OpenAI’s text-embedding-ada-002** model. It requires an OpenAI API key.



### CQRS Pattern
This app follows the **CQRS (Command Query Responsibility Segregation) pattern** to decouple commands from queries, ensure clean architecture and
serve as additional layer between services and controllers.



## Running the Application
Start the application using:
```sh
yarn start
```
For development mode with hot reload:
```sh
npm start:dev
```

## License
This project is licensed under the MIT License.
