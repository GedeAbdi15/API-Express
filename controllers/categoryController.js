const db = require("../dbConnection");

// category : method get
exports.getAllCategory = (req, res) => {
    const sql = "SELECT * FROM master_category";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch category cause ", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                category: results,
            },
        });
    });
};

// category : method post
exports.createCategory = async (req, res) => {
    try {
        const sql = "INSERT INTO master_category (category) VALUES (?)";
        const { category } = req.body;

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category required",
            });
        }

        db.query(sql, [category], (err, result) => {
            if (err) {
                console.error("Failed to insert category cause ", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(201).json({
                success: true,
                message: "Category added successfully",
                data: {
                    // id: result.insertId,
                    category: result,
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

// category : method put
exports.updateCategory = (req, res) => {
    const id = req.params.id;
    const { category } = req.body;

    const sql = "UPDATE `master_category` SET `category`= ? WHERE `id` = ?";
    const val = [category, id];

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
            message: "Category updated successfully",
            data: {
                category: result,
            },
        });
    });
};

// category : mehod delete
exports.deleteCategory = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM `master_category` WHERE `id` = ?";

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
            message: "Category deleted successfully",
        });
    });
};
