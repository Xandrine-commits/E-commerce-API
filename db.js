require("dotenv").config();

const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={ODBC Driver 18 for SQL Server};" +
        `Server=${process.env.DB_SERVER};` +
        `Database=${process.env.DB_NAME};` +
        "Trusted_Connection=Yes;" +
        "TrustServerCertificate=Yes;"
};

module.exports = {
    sql,
    config
};