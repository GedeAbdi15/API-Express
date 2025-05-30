const mysql = require("mysql2");

// Buat koneksi
const db = mysql.createConnection({
    host: "localhost", // sesuaikan dengan host MySQL kamu
    user: "root", // user MySQL kamu
    password: "", // password MySQL kamu
    database: "laundry", // ganti dengan nama database kamu
});

// Tes koneksi
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    } else {
        console.log("Connected to MySQL database");
    }
});

module.exports = db;
