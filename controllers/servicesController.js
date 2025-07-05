const db = require("../dbConnection");

// service : method get
exports.getAllService = async (req, res) => {
    try {
        const result = await db`
        SELECT services.id, services.name, master_category.category, services.type, services.duration_days, services.unit, services.price, services.description, services.created_at, services.updated_at FROM services LEFT JOIN master_category ON master_category.id = services.category`;

        res.status(200).json({
            success: true,
            data: {
                services: result,
            },
        });
    } catch (err) {
        console.error("Failed to fetch roles cause ", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
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

    if (type != "express" && type != "regular") {
        return res.status(400).json({
            success: false,
            message: "Type fields must be fill as 'express' or 'regular'",
        });
    }

    try {
        const result = await db`
            INSERT INTO services (name, category, type, duration_days, unit, price, description) VALUES (${name},${category},${type},${duration_days},${unit},${
            price ?? 0
        }, ${description || null})`;

        res.status(201).json({
            success: true,
            message: "Service added successfully",
            data: {
                service: result,
            },
        });
    } catch (err) {
        console.error("Failed to insert service cause ", err.message);
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
        const result = await db`
            UPDATE services SET name= ${name} , category= ${category} , type= ${type} , duration_days= ${duration_days}, unit = ${unit}, price = ${price}, description = ${description}  WHERE id = ${id}`;

        res.status(200).json({
            success: true,
            message: "service updated successfully",
            data: {
                services: result,
            },
        });
    } catch (err) {
        console.error("Failed to update service with id cause", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// service : method delete
exports.deleteService = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await db`
        DELETE FROM services WHERE id = ${id}`;

        res.status(200).json({
            success: true,
            message: "Service deleted successfully",
            data: {
                service: result,
            },
        });
    } catch (err) {
        console.error("Failed to delete service with id cause", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};
