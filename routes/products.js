const express = require("express");
const { sql } = require("../db");
const authenticateToken = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.use(authenticateToken);


router.get("/", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT *
            FROM dbo.Products
        `);

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message:"Product ID must be a valid number"
            });
        }

        const result = await sql.query`
            SELECT *
            FROM dbo.Products
            WHERE Id = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({
            message:"Failed to fetch product",
            error: error.message
        });
    }
});

router.post("/", requireRole("Admin"), async (req, res) => {
    try {
        const { name, price} = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message:"Product name is required"
            });
        }

        if (price === undefined || price <= 0) {
            return res.status(400).json({
                message: "Price must be greater than 0"
            });
        }

        const result = await sql.query`
            INSERT INTO dbo.Products (Name, Price)
            OUTPUT INSERTED.*
            VALUES (${name}, ${price})
        `;

        res.status(201).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
});

router.put("/:id", requireRole("Admin"), async (req, res) => {
    try {
        const id = Number(req.params.id);

        if(isNaN(id) || id <= 0) {
           return res.status(400).json({
            message: "Product ID must be a valid number"
           });
        }

        const { name, price } = req.body;

        if (price === undefined || price<= 0) {
            return res.status(400).json({
                message: "Price must be greater than 0"
            });
            
        }

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message:"Product name is required"
            });
        }

        const result = await sql.query`
            UPDATE dbo.Products
            SET Name = ${name},
                Price = ${price}
            OUTPUT INSERTED.*
            WHERE Id = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message:"Product not found"
            });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json ({
            message: "Failed to update product",
            error: error.message
        });
    }
    
});

router.delete("/:id", requireRole("Admin"), async (req, res) => {
    try {
        const id = Number(req.params.id);

        if(isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: "Product ID must be a valid number"
            });
        }

        const result = await sql.query`
            DELETE FROM dbo.Products
            OUTPUT DELETED.*
            WHERE Id = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message:"Product not found"
            });
        }

        res.json(result.recordset[0]);
    } catch(error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
});

module.exports = router;