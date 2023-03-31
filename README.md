# ReaderScout Core API

# Deployment Steps

1. Check the migrations
    
- set the database url to `readerscout-dev` or `readerscout-prod` in the `.env` file according to the environment you're planning to do the release
- check the migration status by running the command `npm run migrate:status`
- if there are pending migrations, then run the migrations by running the `npm run migrate:up` command
- if something went wrong while migrating run the `npm run migrate:down` command to rollback the migrations

2. Remove unwanted files/folder

- Remove the `node_modules` folder, `migrations` folder and the `.env` file.

3. Install the production-only packages

    ```bash
    yarn --prod
    ```

4. Use the aws vscode extension to upload the files
