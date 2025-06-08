const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());

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

// endpoint services
const serviceRoutes = require("./routes/services");
app.use("/services", serviceRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
