const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL).then(console.log("MongoDB Connected"));
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`Running at http://localhost:${port}`);
});
