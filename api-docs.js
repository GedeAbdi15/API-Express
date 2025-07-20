const express = require("express");
const serverless = require("serverless-http");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json"); // path ke file swagger

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
module.exports.handler = serverless(app);
