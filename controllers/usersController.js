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
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db`
            SELECT 
                users.id, uid, roles.id AS role_id, roles.role, 
                users.name, users.email, users.password, users.phone_number, 
                users.created_at, users.updated_at, users.deleted_at
            FROM users 
            LEFT JOIN roles ON roles.id = users.role
        `;

        res.status(200).json({
            success: true,
            data: {
                users: result,
            },
        });
    } catch (err) {
        console.error("Failed to fetch users cause ", err);
        res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};

// users : method get (customer)
exports.getCustomers = async (req, res) => {
    try {
        const results = await db`
        SELECT users.id, uid, roles.id AS role_id, roles.role, users.name, users.email, users.password, users.phone_number, users.created_at, users.updated_at, users.deleted_at FROM users LEFT JOIN roles ON roles.id = users.role WHERE roles.role ILIKE '%customer%'
        `;
        console.log("debug cust : ", results);

        res.status(200).json({
            success: true,
            data: {
                customers: results,
            },
        });
    } catch (err) {
        console.error("Failed to fetch users cause ", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};

// users : method post
exports.createUser = async (req, res) => {
    const { name, email, password, role_id, phone_number } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required",
        });
    }

    try {
        const uid = generateUID();

        let encryptedPassword = null;
        if (password && password.trim() != "") {
            encryptedPassword = await bcrypt.hash(password, 10);
        }

        const result = await db`
            INSERT INTO users (uid, name, email, password, role, phone_number) 
            VALUES (${uid}, ${name}, ${
            email || null
        }, ${encryptedPassword}, ${role_id}, ${
            phone_number || null
        }) RETURNING id, uid, name, email, role, phone_number, created_at`;

        console.log("result log : ", result);

        res.status(201).json({
            success: true,
            message: "User added successfully",
            data: {
                user: result,
            },
        });
    } catch (err) {
        console.error("Failed to insert user cause ", err.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// users : method put
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { role_id, name, email, password, phone_number } = req.body;

    try {
        const hashedPassword = null;
        if (password && password.trim() != "") {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const result = await db`
            UPDATE users SET role= ${role_id} , name= ${name} , email= ${
            email || null
        } , password= ${hashedPassword}, phone_number = ${
            phone_number || null
        }  WHERE id = ${id}
            `;

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                user: result,
            },
        });
    } catch (err) {
        console.error("Failed to update user with id cause", err);
        res.status(500).json({
            success: false,
            message: "Server error while hashing password",
        });
    }
};

// users : mehod delete
exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db`
    DELETE FROM users WHERE id = ${id}
    `;

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: {
                user: result,
            },
        });
    } catch (err) {
        console.error("Failed to delete user with id cause", err);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};
