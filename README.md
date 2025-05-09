# CookAtlas DB Project

## Requirements

- **Git**
- **PostgreSQL** (installed locally)
- **Node.js**


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

## Connecting DBMS to interface
1. Install pg and dotenv packages (if not installed yet)
   ```
   npm init -y
   npm install pg dotenv
   ```
2. Create .env file in root to store sensitive information (database credentials)
   ```
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   DB_PORT=5432
   ```
   DO NOT PUSH .env file, add to .gitignore!
   If you don't know your username, go to pgAdmin4, the PSQL tool, and enter "\du".

3. Test connection using the terminal and running this in the backend directory
   ```
   npm run dev
   ```

## Running the GUI
1. cd into the code folder, there will be a backend, frontend, dependencies and a bash file.
2. Run the bash file in order to install all dependencies required using git bash.
   ```
   ./clean-and-build.sh
   ```
3. Make two seperate terminal instances and cd into both backend and frontend directories, run
   this command for both:
   ```
   npm run dev
   ```
4. Enter the localhost URL provided and user is taken to the GUI.
5. Users can browse the pages and/or register an account.

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



