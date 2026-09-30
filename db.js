const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={ODBC Driver 18 for SQL Server};" +
        "Server=DESKTOP-QK8RC98\\SQLEXPRESS;" +
        "Database=EcommerceDB;" +
        "Trusted_Connection=Yes;" +
        "TrustServerCertificate=Yes;"
};

module.exports = {
    sql,
    config
};