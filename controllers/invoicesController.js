const db = require("../dbConnection");

// invoices : method get
exports.getAllInvoices = (req, res) => {
    const sql =
        "SELECT `invoices`.`id`, `invoices`.`invoice_number`, `invoices`.`orders_id`, `users`.`name` AS user_name, `users`.`phone_number` AS phone_number, `services`.`name` AS service_name, `orders`.`total_weight`, `orders`.`total_item`, `services`.`unit`, `orders`.`total_price`, `invoices`.`payment_status`, `invoices`.`pay_at`, `invoices`.`created_at`, `invoices`.`updated_at` FROM `invoices` LEFT JOIN `orders` ON `invoices`.`orders_id` = `orders`.`id` LEFT JOIN `users` ON `orders`.`users_id` = `users`.`id` LEFT JOIN `services` ON `orders`.`services_id` = `services`.`id`";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch invoices cause ", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                invoices: results,
            },
        });
    });
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
        const sql =
            "INSERT INTO `invoices` (`orders_id`, `invoice_number`) VALUES (?,?)";
        const val = [orders_id, invoice_number];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to insert invoice cause ", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(201).json({
                success: true,
                message: "Invoices added successfully",
                data: {
                    invoices: result,
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

// invoices : method put
exports.updateInvoices = async (req, res) => {
    const id = req.params.id;
    const { orders_id, pay_at, payment_status } = req.body;

    try {
        const sql =
            "UPDATE `invoices` SET `orders_id`= ?, `pay_at`= ?, `payment_status`= ? WHERE `id` = ?";
        const val = [orders_id, pay_at, payment_status, id];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to update invoice with id cause", err);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(200).json({
                success: true,
                message: "Invoice updated successfully",
                data: {
                    invoices: result,
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

// invoices : method delete
exports.deleteInvoices = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM `invoices` WHERE `id` = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(
                "Failed to delete Invoices with id cause",
                err.message
            );
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            message: "Invoices deleted successfully",
        });
    });
};
