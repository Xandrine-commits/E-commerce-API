const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sql } = require("../db")

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const result = await sql.query`
        SELECT Id, Username, PasswordHash, Role
        FROM dbo.Users
        WHERE Username = ${username}
    `;

    if (result.recordset.length === 0) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const user = result.recordset[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.PasswordHash
    );

    if (!passwordMatch) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }


    const tokenUser = {
        id: user.Id,
        username: user.Username,
        role: user.Role
    };

    const token = jwt.sign(
        tokenUser,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        accessToken: token
    });
});

router.post("/register", async (req, res) => {
    try {
        const { username, password} = req.body;

        if (!username || username.trim() === "") {
            return res.status(400).json({
                message: "Username is required"
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await sql.query`
            SELECT Id
            FROM dbo.Users
            WHERE Username = ${username}
        `;

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({
                message:"Username already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await sql.query`
            INSERT INTO dbo.Users (Username, PasswordHash)
            OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Role
            VALUES (${username}, ${passwordHash})
        `;

        res.status(201).json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({
            message: "Failed to register user",
            error: error.message
        });
    }
});

module.exports = router