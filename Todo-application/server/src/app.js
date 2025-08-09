const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./Routes/authRoutes");
app.use(authRoutes);

const todoRoutes = require("./Routes/todoRoutes");
app.use(todoRoutes);

module.exports = app;
