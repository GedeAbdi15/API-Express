const prisma = require("../prisma/prismaClient");

// roles : method get
exports.getAllRoles = async (req, res) => {
    try {
        const result = await prisma.roles.findMany();

        res.status(200).json({
            success: true,
            data: {
                roles: result,
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

// roles : method post
exports.createRoles = async (req, res) => {
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({
            success: false,
            message: "Role required",
        });
    }

    try {
        const result = await prisma.roles.create({
            data: {
                role: role,
            },
            select: {
                id: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "Role added successfully",
            data: {
                role: result,
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

// roles : method put
exports.updateRoles = async (req, res) => {
    const id = req.params.id;
    const { role } = req.body;

    try {
        const result = await prisma.roles.update({
            where: {
                id: parseInt(id),
            },
            data: {
                role: role,
            },
            select: {
                id: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: {
                role: result,
            },
        });
    } catch (error) {
        console.error("Database error: ", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};

// roles : method delete
exports.deleteRoles = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await prisma.roles.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
            data: {
                role: result,
            },
        });
    } catch (error) {
        console.error("Failed to delete user with id cause", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};
