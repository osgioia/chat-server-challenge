# Node.js Chat Server

## Overview
This project is a chat server built using Node.js, providing RESTful endpoints for user authentication, sending and receiving messages with Websockets and storing messages in a database.

## Table of Contents

<!-- toc -->

- [Node.js Chat Server](#nodejs-chat-server)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [TODO](#todo)
  - [🛠️ Prerequisites](#-prerequisites)
  - [🚀 Deployment](#-deployment)
  - [🔒 Environment Configuration](#-environment-configuration)
  - [✅ Testing](#-testing)
  - [📝 Open API](#-open-api)
  - [License](#license)

<!-- tocstop -->

## Features

- User authentication with basic username/password login
- Single chat room creation on server startup
- Persistent storage of chat messages
- Unit testing
- WebSocket support for real-time chat previously with RESTful endpoints for sending and retrieval messages
- CI/CD to deploy with Github Actions
- Server scalability with Clustering

## TODO

- Message deletion by clients


### 🛠️ Prerequisites

#### Non Docker

- Please make sure to either have MongoDB Community installed locally or a subscription to Mongo on the cloud by configuration a cluster in [atlas](https://www.mongodb.com/cloud/atlas). 

#### Docker 🐳

- Please make sure to have docker desktop setup on any preferred operating system to quickly compose the required dependencies. Then follow the docker procedure outlined below.

**Note**: Docker Desktop comes free on both Mac and Windows, but it only works with Windows 10 Pro. A workaround is to get [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) which will bypass the Windows 10 Pro prerequisite by executing in a VM.

---

### 🚀 Deployment

#### Manual Deployment without Docker

- Create a `.env` file using the `cp .env.example .env` command and replace the existing env variables with personal settings (MongoDB URL either `srv` or `localhost`)

- Download dependencies using `npm i` or `yarn`

- Start the app in pre-production mode using `npm run start` or `npm run start:dev` for development (the app will be exposed on the port 9000; not to conflict with React, Angular, or Vue)

#### Deploying with Docker 🐳

- Execute the following command in-app directory:

```bash
# creates and loads the docker container with required configuration
$ docker-compose up -d 
```
- The following command will set up and run the docker project for quick use. Then the web application, and MongoDB will be exposed to http://localhost:9000 and http://localhost:27017 respectively.

### 🔒 Environment Configuration

By default, the application comes with a config module that can read in every environment variable from the `.env` file.

**APP_ENV** - the application environment to execute as, either in development or production. Determines the type of logging options to utilize. Options: `dev` or `prod`. 

**APP_URL** - the base URL for the application. Made mainly to showcase the power of `ConfigService` and can be removed as it doesn't serve any other purpose

**WEBTOKEN_SECRET_KEY** - the secret key to encrypt/decrypt web tokens with. Make sure to generate a random alphanumeric string for this.

**WEBTOKEN_EXPIRATION_TIME** - **the time in seconds** indicating when the web token will expire; by default, it's 2400 seconds which is 40 mins.

**DB_URL** - the URL to the MongoDB collection

**PORT** - Application PORT

**WEBSOCKET_PORT** - Port for listening messages with WebSocket


---

### ✅ Testing

#### Docker 🐳

```bash
# unit tests
$ docker exec -it nest yarn test

# e2e tests
$ docker exec -it nest yarn test:e2e

```

#### Non-Docker

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```

---

### 📝 Open API

Out of the box, the web app comes with Swagger; an [open api specification](https://swagger.io/specification/), that is used to describe RESTful APIs. Nest provides a [dedicated module to work with it](https://docs.nestjs.com/recipes/swagger).

The Swagger URL is [http://localhost:9000/api/docs](http://localhost:9000/api/docs) but also follows the example of ``Chat Challenge.postman_collection.json`` in the root directory.

---

## License

Nest is [MIT licensed](LICENSE).

[Author](https://osgioia.dev/)