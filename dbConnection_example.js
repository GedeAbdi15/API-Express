const mysql = require("mysql2");

// Buat koneksi
const db = mysql.createConnection({
    host: "localhost", // sesuaikan dengan host MySQL yang digunakan
    user: "root", // user MySQL
    password: "", // password MySQL
    database: "", // ganti dengan nama database yang digunakan
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
