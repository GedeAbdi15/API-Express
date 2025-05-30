const express = require("express");
const bodyParser = require("body-parser");
const db = require("./dbConnection");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("helo");
});

// endpoint users
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// endpoint roles
const roleRoutes = require("./routes/roles");
app.use("/roles", roleRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
