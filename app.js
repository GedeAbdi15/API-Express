// app.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

const app = express();

app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test root
app.get("/", (req, res) => {
    res.send("Hello! Check /api-docs for documentation");
});

// Routes
app.use("/users", require("./routes/users"));
app.use("/roles", require("./routes/roles"));
app.use("/services", require("./routes/services"));
app.use("/categories", require("./routes/category"));
app.use("/transaction/orders", require("./routes/orders"));
app.use("/transaction/invoices", require("./routes/invoices"));

module.exports = app;
