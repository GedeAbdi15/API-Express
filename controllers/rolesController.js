const db = require("../dbConnection");

// roles : method get
exports.getAllRoles = (req, res) => {
    const sql = "SELECT * FROM roles";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch roles cause ", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            roles: results,
        });
    });
};

// roles : method post
exports.createRoles = async (req, res) => {
    const role = req.body;

    if (!role) {
        return res.status(400).json({
            success: false,
            message: "Role required",
        });
    }

    try {
        const sql = "INSERT INTO roles (role) VALUES (?)";

        db.query(sql, role, (err, result) => {
            if (err) {
                console.error("Failed to insert user cause ", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(201).json({
                success: true,
                message: "Role added successfully",
                Roles: {
                    role,
                },
            });
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// roles : method put
exports.updateRoles = (req, res) => {
    const id = req.params.id;
    const { role } = req.body;

    const sql = "UPDATE `roles` SET `role`= ? WHERE `id` = ?";
    const val = [role, id];

    db.query(sql, val, (err, result) => {
        if (err) {
            console.error("Database error: ", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            Roles: {
                id,
                role,
            },
        });
    });
};

// roles : mehod delete
exports.deleteRoles = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM `roles` WHERE `id` = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Failed to delete user with id cause", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
    });
};
