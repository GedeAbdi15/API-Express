const prisma = require("../prisma/prismaClient");

// invoices : method get
exports.getAllInvoices = async (req, res) => {
    try {
        const result = await prisma.invoices.findMany({
            include: {
                orders: {
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
                                unit: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(200).send({
            success: true,
            data: {
                invoices: result,
            },
        });
    } catch (err) {
        console.error("Failed to fetch invoices cause ", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};

function generateInvoiceNum() {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const chars = "INV";
    return `${year}${chars.concat("-")}${randomNum}`;
}

// invoices : method post
exports.createInvoices = async (req, res) => {
    const { orders_id } = req.body;
    const invoice_number = generateInvoiceNum();

    if (!orders_id) {
        return res.status(400).json({
            success: false,
            message: "Please fill required fields",
        });
    }

    try {
        const result = await prisma.invoices.create({
            data: {
                orders_id: orders_id,
                invoice_number: invoice_number,
            },
            include: {
                orders: {
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
                                unit: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: "Invoices added successfully",
            data: {
                invoices: result,
            },
        });
    } catch (err) {
        console.error("Failed to insert invoice cause ", err.message);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// invoices : method put
exports.updateInvoices = async (req, res) => {
    const id = req.params.id;
    const { orders_id, pay_at, payment_status } = req.body;

    try {
        const result = await prisma.invoices.update({
            where: {
                id: parseInt(id),
            },
            data: {
                orders_id: parseInt(orders_id),
                payment_status: payment_status,
                pay_at: payment_status == "paid" ? new Date() : null,
            },
            include: {
                orders: {
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
                                unit: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "Invoice updated successfully",
            data: {
                invoices: result,
            },
        });
    } catch (err) {
        console.error("Failed to update invoice with id cause", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// invoices : method delete
exports.deleteInvoices = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await prisma.invoices.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({
            success: true,
            message: "Invoices deleted successfully",
            data: {
                invoices: result,
            },
        });
    } catch (err) {
        console.error("Failed to delete Invoices with id cause", err.message);
        return res.status(500).json({
            success: false,
            message: "Database connection error",
        });
    }
};
