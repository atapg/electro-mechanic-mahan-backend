require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

require("./app/config/mongodb");

app.use("/api/products", require("./app/routes/products"));
app.use("/api/admins", require("./app/routes/admins"));
app.use("/api/upload", require("./app/routes/files"));
app.use("/api/public", require("./app/routes/public"));
app.use("/api/site-setting", require("./app/routes/site"));
app.use("/api/images", require("./app/routes/images"));
app.use("/api/messages", require("./app/routes/messages"));

app.get("/", (req, res) => {
  res.send("Welcome to Electro Mechanic Mahan Api service!");
});

const port = process.env.PORT || 8585;

app.listen(port, () => console.log(`Server running on port ${port}`));
