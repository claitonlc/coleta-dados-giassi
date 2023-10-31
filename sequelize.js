const { Sequelize } = require("sequelize");

module.exports = {
    
    connectDB: async function () {
        let sequelize;

        const config = {
            dialect: "mysql",
            host: process.env.db_host,
            username: process.env.db_user,
            password: process.env.db_pass,
            database: process.env.db_database,
        };
        sequelize = await new Sequelize(config);
        return sequelize;
    },

    runQuery: async function (query) {
        try {
            let connection = await this.connectDB();
            const result = await connection.query(query);
            await this.closeConnection(connection);
            return result;
        } catch (error) {
            console.error("Error: " + error);
            return false;
        }
    },

    closeConnection: async function (connection) {
        await connection.close();
        return true;
    }
}