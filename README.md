# CookAtlas DB Project

## Requirements

- **Git**
- **PostgreSQL** (installed locally)

## Local Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/lukyan01/cook-atlas.git
   cd cookatlas-db
   ```

2. **Install PostgreSQL**
   Visit [postgresql.org](https://www.postgresql.org/download/) and install for your OS.

## Exporting DB
   ```
   PGPASSWORD="yourpassword" pg_dump -U postgres -d cookatlas > cookatlas_dump.sql
   ```

## Importing DB
1. Create the database (if not yet created)
   ```
   psql -U postgres -c "CREATE DATABASE cookatlas;"
   ```

2. Load the Schema and Data
   ```
   psql -U postgres -d cookatlas -f cookatlas_dump.sql
   ```


## GIT Workflow

1. Update Main
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create Branch
   ```bash
   git checkout -b feature/my-changes
   ```

3. Commit Changes
   ```bash
    git add .
    git commit -m "My changes"
    ```
   
4. Squash Commits
   ```bash
   git rebase -i HEAD~<num_of_commits>
   git push -u origin feature/my-changes
   ```

5. Merge Into Main (plz dont break working code)

