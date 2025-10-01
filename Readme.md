## Run server side

1. Pull the git repo

    ```
    git pull
    ```

2. Update DB - If needed

    ```
    bun run db-generate
    bun run db-migrate
    ```

3. Restart the project.
    ```
    pm2 kill
    pm2 resurrect
    ```
