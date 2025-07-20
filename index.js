const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("helo");
});

// endpoint users
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// endpoint roles
const roleRoutes = require("./routes/roles");
app.use("/roles", roleRoutes);

// endpoint services
const serviceRoutes = require("./routes/services");
app.use("/services", serviceRoutes);

// endpoint categories
const categoryRoutes = require("./routes/category");
app.use("/categories", categoryRoutes);

// endpoint orders
const ordersRoutes = require("./routes/orders");
app.use("/transaction/orders", ordersRoutes);

// endpoint invoices
const invoicesRoutes = require("./routes/invoices");
app.use("/transaction/invoices", invoicesRoutes);

// module.exports = app;
module.exports.handler = serverless(app);
