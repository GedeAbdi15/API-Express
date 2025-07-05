const postgres = require("postgres");
require("dotenv").config();

const db = postgres(process.env.DATABASE_URL, {
    ssl: "require",
});

console.log("Connecting to:", process.env.DATABASE_URL);
module.exports = db;
