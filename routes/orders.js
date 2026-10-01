const express = require("express");
const { sql } = require("../db");
const { productExists } = require("../helpers/productHelper");
const authenticateToken = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();
router.use(authenticateToken);

router.get("/", async (req , res) => {
    try {
        const result = await sql.query(`
            SELECT
                Orders.Id,
                Orders.ProductId,
                Products.Name AS ProductName,
                Products.Price,
                Orders.Quantity,
                (Products.Price * Orders.Quantity) AS TotalAmount,
                Orders.OrderDate
            FROM dbo.Orders
            INNER JOIN dbo.Products
                ON Orders.ProductId = Products.Id
        `);

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message:"Order ID must be a valid number"
            });
        }

        const result = await sql.query`
    SELECT
        Orders.Id,
        Orders.ProductId,
        Products.Name AS ProductName,
        Products.Price,
        Orders.Quantity,
        (Products.Price * Orders.Quantity) AS TotalAmount,
Orders.OrderDate
    FROM dbo.Orders
    INNER JOIN dbo.Products
        ON Orders.ProductId = Products.Id
    WHERE Orders.Id = ${id}
`;

        if (result.recordset.length === 0) {
            return res.status(404).json ({
                message: "Order not found"
            });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a whole number greater than 0"
            });
        }

        if (typeof productId !== "number" || productId <= 0) {
    return res.status(400).json({
        message: "Product ID must be greater than 0"
    });
}

        const exists = await productExists(productId);

        if (!exists) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const result = await sql.query`
            INSERT INTO dbo.Orders (ProductId, Quantity)
            OUTPUT INSERTED.*
            VALUES (${productId}, ${quantity})
        `;

        const orderId = result.recordset[0].Id;

        const orderResult = await sql.query`
            SELECT
                Orders.Id,
                Orders.ProductId,
                Products.Name AS ProductName,
                Products.Price,
                Orders.Quantity,
                (Products.Price * Orders.Quantity) AS TotalAmount,
                Orders.OrderDate
            FROM dbo.Orders
            INNER JOIN dbo.Products
                ON Orders.ProductId = Products.Id
            WHERE Orders.Id = ${orderId}
        `;

        res.status(201).json(orderResult.recordset[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
});

router.put("/:id", requireRole("Admin"), async (req,res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message:"Order ID must be a valid number"
            });
        }

        const { productId, quantity } = req.body;

if (typeof productId !== "number" || productId <= 0) {
    return res.status(400).json({
        message: "Product ID must be greater than 0"
    });
}

if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
        message: "Quantity must be a whole number greater than 0"
    });
}
        const exists = await productExists(productId);

        if (!exists) {
            return res.status(404).json({
                message:"Product not found"
            });
        }

        const result = await sql.query`
            UPDATE dbo.Orders
            SET ProductId = ${productId},
                Quantity = ${quantity}
            OUTPUT INSERTED.*
            WHERE Id = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message:"Order not found"
            });
        }

        const orderId = result.recordset[0].Id;

        const orderResult = await sql.query`
    SELECT
        Orders.Id,
        Orders.ProductId,
        Products.Name AS ProductName,
        Products.Price,
        Orders.Quantity,
        (Products.Price * Orders.Quantity) AS TotalAmount,
        Orders.OrderDate
    FROM dbo.Orders
    INNER JOIN dbo.Products
        ON Orders.ProductId = Products.Id
    WHERE Orders.Id = ${orderId}
`;

        res.json(orderResult.recordset[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update order",
            error: error.message
        });
    }
});

router.delete("/:id", requireRole("Admin"), async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message:"Order ID must be a valid number"
            });
        }

        const result = await sql.query`
            DELETE FROM dbo.Orders
            OUTPUT DELETED.*
            WHERE Id = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message:"Order not found"
            });
        }

        const deletedOrder = result.recordset[0];

        const orderResult = await sql.query`
            SELECT
                ${deletedOrder.Id} AS Id,
                ${deletedOrder.ProductId} AS ProductId,
                Products.Name AS ProductName,
                Products.Price,
                ${deletedOrder.Quantity} AS Quantity,
                (Products.Price * ${deletedOrder.Quantity}) AS TotalAmount,
                ${deletedOrder.OrderDate} AS OrderDate
            FROM dbo.Products
            WHERE Products.Id = ${deletedOrder.ProductId}
        `;

        res.json(orderResult.recordset[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete order",
            error: error.message
        });
    }
});

module.exports = router;