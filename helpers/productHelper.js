const { sql } = require("../db");

async function productExists(productId) {
    const result = await sql.query`
        SELECT Id
        FROM dbo.Products
        WHERE Id = ${productId}
    `;

    return result.recordset.length > 0;
    
}

module.exports = { productExists };