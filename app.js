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

// endpoint users
const userRoutes = require("../routes/users");
app.use("/users", userRoutes);

// endpoint roles
const roleRoutes = require("../routes/roles");
app.use("/roles", roleRoutes);

// endpoint services
const serviceRoutes = require("../routes/services");
app.use("/services", serviceRoutes);

// endpoint categories
const categoryRoutes = require("../routes/category");
app.use("/categories", categoryRoutes);

// endpoint orders
const ordersRoutes = require("../routes/orders");
app.use("/transaction/orders", ordersRoutes);

// endpoint invoices
const invoicesRoutes = require("../routes/invoices");
app.use("/transaction/invoices", invoicesRoutes);

module.exports = app;
