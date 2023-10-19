
/**
 * DB Hub
 */
class DBHub {
    /**
     * Creates an instance of DBHub.
     *
     * @param {string} api_key - Your API key
     */
    constructor(api_key) {
        // API key check.
        if (!api_key) throw new Error("Missing required API key!");

        this.base_url = "https://api.dbhub.io";
        this.endpoints = this.get_endpoints();
        this.api_key = api_key;
    }

    get_endpoints() {
        const version = 1;

        const endpoints = {
            branches: `/v${version}/branches`,
            columns: `/v${version}/columns`,
            commits: `/v${version}/commits`,
            databases: `/v${version}/databases`,
            delete: `/v${version}/delete`,
            execute: `/v${version}/execute`,
            query: `/v${version}/query`,
        };

        return endpoints;
    }

    async make_request(url, parameters) {
        // Body form data.
        const body = new FormData();
        body.append("apikey", this.api_key);

        // Prepare parameters.
        for (const [key, value] of Object.entries(parameters)) {
            body.append(key, value);
        }

        // Send request.
        const response = await fetch(url, {
            method: "POST",
            body,
        }).catch((error) => {
            throw new Error("Fetch failed!", error);
        });

        // Status check.
        if (!response?.ok) {
            const {error} = await response.json();

            throw new Error(`DBHub API error message: ${error} [HTTP status: ${response?.status}]`);
        }

        return await response.json();
    }

    /**
     * Returns the list of branches for a database
     *
     * @param {string} dbowner The owner of the database
     * @param {string} dbname The name of the database
     *
     * @returns {Promise<object>}
     */
    async get_branches(dbowner, dbname) {
        const url = `${this.base_url}${this.endpoints.branches}`;

        const parameters = {
            dbowner,
            dbname,
        };

        const data = await this.make_request(url, parameters);

        return data;
    }

    /**
     * Returns the details of all columns in a table or view, as per the SQLite "table_info" PRAGMA
     *
     * @param {string} dbowner The owner of the database
     * @param {string} dbname The name of the database
     * @param {string} table The name of the table or view to return column information for
     *
     * @returns {Promise<object[]>}
     */
    async get_columns(dbowner, dbname, table) {
        const url = `${this.base_url}${this.endpoints.columns}`;

        const parameters = {
            dbowner,
            dbname,
            table,
        };

        const data = await this.make_request(url, parameters);

        return data;
    }

    /**
     * Returns the details of all commits for a database
     *
     * @param {string} dbowner The owner of the database
     * @param {string} dbname The name of the database
     *
     * @returns {Promise<object>}
     */
    async get_commits(dbowner, dbname) {
        const url = `${this.base_url}${this.endpoints.commits}`;

        const parameters = {
            dbowner,
            dbname,
        };

        const data = await this.make_request(url, parameters);

        return data;
    }

    /**
     * Returns the list of databases in the requesting users account
     *
     * @param {boolean} live A boolean to switch between returning the list of standard databases, and the list of live databases
     *
     * @returns {Promise<object[]|null>}
     */
    async get_databases(live = false) {
        const url = `${this.base_url}${this.endpoints.databases}`;

        const parameters = {
            live,
        };

        const data = await this.make_request(url, parameters);

        return data;
    }

    /**
     * Deletes a database from the requesting users account
     *
     * @param {string} dbname The name of the database
     *
     * @returns {Promise<object>}
     */
    async delete_database(dbname) {
        const url = `${this.base_url}${this.endpoints.delete}`;

        const parameters = {
            dbname,
        };

        const data = await this.make_request(url, parameters);

        return data;
    }

    /**
     * Executes a SQLite statement on a LIVE database. eg INSERT, UPDATE, DELETE
     *
     * @param {string} dbowner The owner of the database
     * @param {string} dbname The name of the database
     * @param {string} sql The SQL query
     *
     * @returns {Promise<object>}
     */
    async execute(dbowner, dbname, sql) {
        const url = `${this.base_url}${this.endpoints.execute}`;

        const parameters = {
            dbowner,
            dbname,
            sql: btoa(sql),
        };

        const data = await this.make_request(url, parameters);

        return data;
    }

    /**
     * Run a SQLite SELECT query on a database
     *
     * @param {string} dbowner The owner of the database
     * @param {string} dbname The name of the database
     * @param {string} sql The SQL query
     *
     * @returns {Promise<Array|null>}
     */
    async query(dbowner, dbname, sql) {
        const url = `${this.base_url}${this.endpoints.query}`;

        const parameters = {
            dbowner,
            dbname,
            sql: btoa(sql),
        };

        const data = await this.make_request(url, parameters);

        return data;
    }
}

// Export.
export default DBHub;
