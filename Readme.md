## Run server side

1. Pull the git repo

    ```
    git pull
    ```

2. Update DB - If needed

    ```
    npm run db-generate
    npm run db-migrate
    ```

3. Restart the project.
    ```
    pm2 kill
    pm2 resurrect
    ```
