
const express = require("express");
const { sql, config } = require("./db");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "E-commerce API is running"
    });
});


sql.connect(config)
    .then(() => {
        console.log("Connected to SQL Server");
    })
    .catch((err) => {
        console.error("SQL Server connection failed", err);

    });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
