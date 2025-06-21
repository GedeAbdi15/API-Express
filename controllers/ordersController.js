const db = require("../dbConnection");

// orders : method get
exports.getAllOrders = (req, res) => {
    const sql =
        "SELECT `orders`.`id`, `users`.`id` AS users_id, `users`.`name` AS user_name, `users`.`phone_number`,`services`.`id` AS services_id, `services`.`name` AS service_name, `master_category`.`category`, `services`.`type`, `services`.`duration_days`, `orders`.`total_weight`, `orders`.`total_item`, `services`.`unit`, `services`.`price`,`orders`.`total_price`, `orders`.`status`, `orders`.`created_at`, `orders`.`updated_at` FROM `orders` LEFT JOIN `users` ON `users`.`id` = `orders`.`users_id` LEFT JOIN `services` ON `services`.`id` = `orders`.`services_id` LEFT JOIN `master_category` ON `master_category`.`id` = `services`.`category` WHERE 1";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Failed to fetch orders cause ", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                orders: results,
            },
        });
    });
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

    if (status != "on progress" && status != "done") {
        return res.status(400).json({
            success: false,
            message: "Status fields must be fill as 'on progress' or 'done'",
        });
    }

    try {
        const sql =
            "INSERT INTO orders (users_id, services_id, total_weight, total_item, total_price, status) VALUES (?,?,?,?,?,?)";
        const val = [
            users_id,
            services_id,
            total_weight,
            total_item,
            total_price,
            status,
        ];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to insert order cause ", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(201).json({
                success: true,
                message: "Order added successfully",
                data: {
                    orders: result,
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
        const sql =
            "UPDATE `orders` SET `users_id`= ? , `services_id`= ? , `total_weight`= ? , `total_item`= ?, `total_price` = ?, `status` = ? WHERE `id` = ?";
        const val = [
            users_id,
            services_id,
            total_weight,
            total_item,
            total_price,
            status,
            id,
        ];

        db.query(sql, val, (err, result) => {
            if (err) {
                console.error("Failed to update order with id cause", err);
                return res.status(500).json({
                    success: false,
                    message: "Database connection error",
                });
            }

            res.status(200).json({
                success: true,
                message: "order updated successfully",
                data: {
                    orders: result,
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

// orders : method delete
exports.deleteOrders = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM `orders` WHERE `id` = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.error("Failed to delete order with id cause", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    });
};
