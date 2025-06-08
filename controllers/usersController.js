const db = require("../dbConnection");
const bcrypt = require("bcrypt");

// function generate UID
// format example : last 2 digits of this year + 2 digits random number + 2 digits random alphabet
function generateUID() {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters =
        chars.charAt(Math.floor(Math.random() * 26)) +
        chars.charAt(Math.floor(Math.random() * 26));
    return `${year}${randomNum}${randomLetters}`;
}

// users : method get
exports.getAllUsers = (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch users cause ", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            users: results,
        });
    });
};

// users : method post
exports.createUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required",
        });
    }

    try {
        const uid = generateUID();
        const encryptedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (uid, name, email, password, role, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
        const val = [uid, name, email, encryptedPassword, role, phone];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to insert user cause ", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(201).json({
                success: true,
                message: "User added successfully",
                user: {
                    uid,
                    role,
                    name,
                    email,
                    password,
                    phone,
                },
            });
        });
    } catch (err) {
        console.error("Error hashing password cause ", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// users : method put
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { role, name, email, password, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "UPDATE `users` SET `role`= ? , `name`= ? , `email`= ? , `password`= ?, `phone_number` = ?  WHERE `id` = ?";
        const val = [role, name, email, hashedPassword, phone, id];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to update user with id cause", err);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                user: {
                    id,
                    role,
                    name,
                    email,
                    phone,
                },
            });
        });
    } catch (err) {
        console.error("Error hashing password: ", err.message);
        res.status(500).json({
            success: false,
            message: "Server error while hashing password",
        });
    }
};

// users : mehod delete
exports.deleteUser = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM `users` WHERE `id` = '?'";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Failed to delete user with id cause", err);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    });
};
