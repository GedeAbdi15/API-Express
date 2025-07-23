const prisma = require("../prisma/prismaClient");

// category : method get
exports.getAllCategory = async (req, res) => {
    try {
        const result = await prisma.master_category.findMany();

        res.status(200).json({
            success: true,
            data: {
                category: result,
            },
        });
    } catch (err) {
        console.error("Failed to fetch category cause ", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};

// category : method post
exports.createCategory = async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({
            success: false,
            message: "Category required",
        });
    }

    try {
        const result = await prisma.master_category.create({
            data: {
                category: category,
            },
            select: {
                id: true,
                category: true,
                created_at: true,
                updated_at: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "Category added successfully",
            data: {
                // id: result.insertId,
                category: result,
            },
        });
    } catch (err) {
        console.error("Failed to insert category cause ", err.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// category : method put
exports.updateCategory = async (req, res) => {
    const id = req.params.id;
    const { category } = req.body;

    try {
        const result = await prisma.master_category.update({
            where: {
                id: parseInt(id),
            },
            data: {
                category: category,
            },
            select: {
                id: true,
                category: true,
                created_at: true,
                updated_at: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: {
                category: result,
            },
        });
    } catch (err) {
        console.error("Database error: ", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};

// category : mehod delete
exports.deleteCategory = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await prisma.master_category.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: {
                category: result,
            },
        });
    } catch (err) {
        console.error("Failed to delete user with id cause", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};
