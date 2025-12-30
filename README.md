# DO NOT UPDATE DISCORD.JS TO V14 OR LATER THE ENTIRE BOT WILL BREAK

- Moses

# ECA

ECA is ACE's very own discord bot! ECA can help you navigate the server, participate in events, give feedback to the club, and have an overall greater ACE experience!

This README contains the setup process for dev and production environments, along with documentation on the bot's architecture.

Familiarity with Node.JS and Docker is assumed.

## Setup Process

After cloning the repository onto your machine, there's two different setup processes depending on whether you want to setup the bot for development or production.

Additionally, please first ensure that Docker is installed on your machine.

### Development Environment Setup

1. Run `npm install` to get ready the Node.JS environment
    * This will also install a pre-commit hook that automatically runs formats your code before commits
2. Create a `.env` file in the root directory, based off `.env.example.dev`
3. Start a local copy of the MongoDB database with `docker compose up -d mongo`
4. Build and run the bot code with `npm run watch`. This will automatically rebuild and restart on file changes

Additionally, there are some other NPM commands defined in this repo that may be of use:

* `start`: Start the bot only
* `build`: Build the bot only
* `format`: Reformat all of the source code
* `format:check`: Check the source code for formatting violations

The `watch` command automatically runs `format`, `build`, and `start` whenever it detects a file change.

### Production Environment Setup

1. Create a `.env` file in the root directory, based off `.env.example.prod`
2. Run `docker compose up -d --build` to start both the development and production containers
    * The Dockerfile is configured to automatically copy the `.env` to the bot container to use when the container is built

When moving the bot to a new production environment, you may also need to migrate the MongoDB database information. This can be done using MongoDB tools.

Please ensure that `mongodump` and `mongorestore` are installed on the host machine (any install is OK).

In order to dump the production database data into a compressed file, ensure that the containers are up, then run the following command on the **host** machine:

```
mongodump --uri "mongodb://localhost:27017/ECA" --archive=db.dump.gz --gzip
```

The data will be dumped in a file called `db.dump.gz`.

In order to restore the bot database data from a compressed file into a running database, ensure that the containers are up, then run the following command on the **host** machine:

```
mongorestore --uri "mongodb://localhost:27017/ECA" --archive=db.dump.gz --gzip
```

Please replace `db.dump.gz` with a path to the dump file you're using.

## Bot Architecture

Production ECA's system architecture is defined by and contained within the `docker-compose.yml` file.

This consists of two main containers:

1. Bot container - Container is built from a base Node.JS image, and then the code is copied over and packages are installed as part of the build process
    * The bot connects to the DB over the Docker container network
2. DB container - A base MongoDB container
    * **The DB is persisted across container rebuilds/recreates through a volume that mounts the host directory `./eca_data/mongo_db`**
        * This prevents the DB contents from being destroyed whenever the container is recreated or rebuilt

## Repository Setup

There are two important things to learn about the repository setup: the build/dev environment and the source directory setup.

### Build and Development Environment

The Node.JS `package.json` is setup with a few packages that are useful to note:

1. TSC - Typescript compiler, main build system that transpiles bot source code (under `src/`) to `dist/`
    * Configured with `tsconfig.json`
2. Nodemon - File watcher, configured to automatically rebuild and restart the dev bot whenever changes are made
    * Configured with `nodemon.json`
3. Prettier - Package for formatting code. Configured using `.prettierrc.json` and is usable as both the `npm run format` command along with being configured as a git hook by Husky
4. Husky - Package for managing git hooks. When installed, it automatically sets up hooks for the repository

### Source Directory Setup

Within the source directory `src/`, there are a number of paths that you should know about. These are:

* `db`: Database-related helpers
* `helpers`: Generic helper functions and constant variables, along with functions for generating Discord embeds used by the bot
* `events`: Contains all events that ECA provides
* `slash-commands`: Contains all slash commands that ECA provides
* `types.ts`: Contains core type definitions used in the bot, along with some typing-specific helper functions
* `index.ts`: Bot entrypoint, initializes DB connection, registers commands and events, and starts the bot
