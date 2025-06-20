const db = require("../dbConnection");

// service : method get
exports.getAllService = (req, res) => {
    const sql = "SELECT * FROM services";

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
            data: {
                services: results,
            },
        });
    });
};

// service : method post
exports.createService = async (req, res) => {
    const { name, category, type, duration_days, unit, price, description } =
        req.body;

    if (!name || !category || !type || !duration_days || !unit || !price) {
        return res.status(400).json({
            success: false,
            message: "Please fill required fields",
        });
    }

    if (unit != "kg" && unit != "item") {
        return res.status(400).json({
            success: false,
            message: "Unit fields must be fill as 'kg' or 'item'",
        });
    }

    if (type != "Express" && type != "Regular") {
        return res.status(400).json({
            success: false,
            message: "Type fields must be fill as 'Express' or 'Regular'",
        });
    }

    try {
        const sql =
            "INSERT INTO services (name, category, type, duration_days, unit, price, description) VALUES (?,?,?,?,?,?,?)";
        const val = [
            name,
            category,
            type,
            duration_days,
            unit,
            price,
            description,
        ];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to insert service cause ", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(201).json({
                success: true,
                message: "Service added successfully",
                data: {
                    service: result,
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

// service : method put
exports.updateService = async (req, res) => {
    const id = req.params.id;
    const { name, category, type, duration_days, unit, price, description } =
        req.body;

    try {
        const sql =
            "UPDATE `services` SET `name`= ? , `category`= ? , `type`= ? , `duration_days`= ?, `unit` = ?, `price` = ?, `description` = ?  WHERE `id` = ?";
        const val = [
            name,
            category,
            type,
            duration_days,
            unit,
            price,
            description,
            id,
        ];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to update service with id cause", err);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(200).json({
                success: true,
                message: "service updated successfully",
                data: {
                    services: result,
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

// service : method delete
exports.deleteService = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM `services` WHERE `id` = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(
                "Failed to delete service with id cause",
                err.message
            );
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    });
};
