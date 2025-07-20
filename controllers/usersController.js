const bcrypt = require("bcrypt");
const prisma = require("../prisma/prismaClient");

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
        const result = await prisma.users.findMany({
            include: {
                roles: true,
            },
        });

        res.status(200).json({
            success: true,
            data: {
                users: { result },
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
        const results = await prisma.users.findMany({
            where: {
                roles: {
                    role: {
                        contains: "customer",
                        mode: "insensitive",
                    },
                },
            },
            include: {
                roles: true,
            },
        });
        // console.log("debug cust : ", results);

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

        const result = await prisma.users.create({
            data: {
                uid,
                name,
                email: email || null,
                password: encryptedPassword,
                role: parseInt(role_id),
                phone_number: phone_number || null,
            },
            select: {
                id: true,
                uid: true,
                name: true,
                email: true,
                role: true,
                phone_number: true,
                created_at: true,
            },
            include: {
                roles: {
                    role: true,
                },
            },
        });

        // console.log("create result log : ", result.data);

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
        let hashedPassword = null;
        if (password && password.trim() != "") {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const dataToUpdate = {
            name,
            email: email || null,
            role: parseInt(role_id),
            phone_number: phone_number || null,
        };

        if (hashedPassword) {
            dataToUpdate.password = hashedPassword;
        }

        const result = await prisma.users.update({
            where: {
                id: parseInt(id), // ✅ fix error: convert to Int
            },
            data: dataToUpdate,
            select: {
                id: true,
                uid: true,
                name: true,
                email: true,
                role: true,
                phone_number: true,
                created_at: true,
            },
            include: {
                roles: {
                    role: true,
                },
            },
        });

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
            message: "Server error while updating user",
        });
    }
};

// users : mehod delete
exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await prisma.users.delete({
            where: { id: parseInt(id) },
        });

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
