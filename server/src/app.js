const express = require("express");
const cors = require("cors");
const logger = require("./middleware/loggerMiddleware");
const app = express();

app.use(express.json());
app.use(cors());
app.use(logger)

const authRoutes = require("./Routes/authRoutes");
app.use(authRoutes);

const todoRoutes = require("./Routes/todoRoutes");
app.use(todoRoutes);

module.exports = app;
