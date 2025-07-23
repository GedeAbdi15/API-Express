const prisma = require("../prisma/prismaClient");

// orders : method get
exports.getAllOrders = async (req, res) => {
    try {
        const result = await prisma.orders.findMany({
            include: {
                users: {
                    select: {
                        name: true,
                        phone_number: true,
                    },
                },
                services: {
                    select: {
                        name: true,
                        type: true,
                        duration_days: true,
                        unit: true,
                        price: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            data: {
                orders: result,
            },
        });
    } catch (err) {
        console.error("Failed to fetch orders cause ", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};

// orders : method post
exports.createOrders = async (req, res) => {
    const {
        users_id,
        services_id,
        total_weight,
        total_item,
        total_price,
        status,
    } = req.body;

    if (!users_id && !services_id) {
        return res.status(400).json({
            success: false,
            message: "Please fill required fields",
        });
    }

    if (status != "on_progress" && status != "done") {
        return res.status(400).json({
            success: false,
            message: "Status fields must be fill as 'on_progress' or 'done'",
        });
    }

    try {
        const result = await prisma.orders.create({
            data: {
                users_id: parseInt(users_id),
                services_id: parseInt(services_id),
                total_weight: parseFloat(total_weight),
                total_item: parseInt(total_item) || null,
                total_price: parseInt(total_price) || 0,
                status: status,
            },
            include: {
                users: {
                    select: {
                        name: true,
                        phone_number: true,
                    },
                },
                services: {
                    select: {
                        name: true,
                        type: true,
                        duration_days: true,
                        unit: true,
                        price: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: "Order added successfully",
            data: {
                orders: result,
            },
        });
    } catch (err) {
        console.error("Failed to insert order cause ", err.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// orders : method put
exports.updateOrders = async (req, res) => {
    const id = req.params.id;
    const {
        users_id,
        services_id,
        total_weight,
        total_item,
        total_price,
        status,
    } = req.body;

    try {
        const result = await prisma.orders.update({
            where: {
                id: parseInt(id),
            },
            data: {
                users_id: parseInt(users_id),
                services_id: parseInt(services_id),
                total_weight: parseFloat(total_weight),
                total_item: parseInt(total_item) || null,
                total_price: parseInt(total_price) || 0,
                status: status,
            },
            include: {
                users: {
                    select: {
                        name: true,
                        phone_number: true,
                    },
                },
                services: {
                    select: {
                        name: true,
                        type: true,
                        duration_days: true,
                        unit: true,
                        price: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "order updated successfully",
            data: {
                orders: result,
            },
        });
    } catch (err) {
        console.error("Failed to update order with id cause", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// orders : method delete
exports.deleteOrders = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await prisma.orders.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: {
                orders: result,
            },
        });
    } catch (error) {
        console.error("Failed to delete order with id cause", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};
