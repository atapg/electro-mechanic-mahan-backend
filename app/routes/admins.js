const routes = require("express").Router();
const AdminsModel = require("../models/admins");
const authMiddleware = require("../middlewares/authenticate");
const adminValidator = require("../validations/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

routes.get("/get-admin", authMiddleware, (req, res) => {
  res.send({ admin: req.authenticatedUser });
});

routes.get("/authenticate", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: "Failed",
      status: "Unauthorized",
    });
  }

  const authorizationParse = req.headers.authorization.split(" ");

  if (authorizationParse.length < 2) {
    return res.status(401).send({
      message: "Failed",
      status: "Unauthorized",
    });
  }

  const token = authorizationParse[1];

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Failed",
        status: "Unauthorized",
      });
    }
  });

  res.status(200).send({
    message: "Success",
    status: "Authorized",
  });
});

routes.post("/login", async (req, res) => {
  const { email, phone, password } = req.body;

  let admin;

  if (email) admin = await AdminsModel.findOne({ email });
  else admin = await AdminsModel.findOne({ phone });

  if (!admin) {
    return res.status(403).send({
      status: "Failed",
      error: "Incorrect credentials!",
    });
  }

  const correctPass = await bcrypt.compare(password, admin.password);

  if (!correctPass) {
    return res.status(403).send({
      status: "Failed",
      error: "Incorrect credentials!",
    });
  }

  const token = jwt.sign({ id: admin._id }, process.env.SECRET, {
    expiresIn: "7d",
  });

  res.send({
    admin,
    token,
  });
});

routes.post("/register", authMiddleware, async (req, res) => {
  const { phone, email, name, password, lastName } = req.body;

  if (!adminValidator(req.body)) {
    return res.status(400).send({
      status: "Failed",
      error: "Please fill all fields",
    });
  }

  const existedUser = await AdminsModel.findOne({ phone, email });

  if (existedUser) {
    return res.status(400).send({
      status: "Failed",
      error: "User already exist!",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (hashedPassword) {
    const admin = await AdminsModel.create({
      name,
      lastName,
      password: hashedPassword,
      email,
      phone,
    });

    if (!admin) {
      return res.status(400).send({
        status: "Failed",
        error: "Something went wrong!",
      });
    }
  }

  res.send({
    status: "Success",
  });
});

routes.delete("/delete", authMiddleware, (req, res) => {
  const { admin_id } = req.body;

  AdminsModel.findByIdAndRemove(admin_id, (err, result) => {
    if (err) {
      return res.status(400).send({
        status: "Failed",
        error: "Something went wrong!",
      });
    }
  });

  res.send({
    status: "Success",
  });
});

routes.patch("/update", authMiddleware, async (req, res) => {
  const { name, lastName, phone, email, password, id } = req.body;

  const updated = await AdminsModel.findByIdAndUpdate(id, {
    name,
    lastName,
    phone,
    email,
  });

  if (!updated) {
    return res.status(400).send({
      status: "Failed",
      error: "Something went wrong!",
    });
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    AdminsModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      (err, result) => {
        if (err) {
          return res.status(400).send({
            status: "Failed",
            error: "Something went wrong!",
          });
        }
      }
    );
  }

  res.send({
    status: "Success",
  });
});

routes.get("/get-all", authMiddleware, async (req, res) => {
  const admins = await AdminsModel.find().select("-password");

  if (!admins) {
    return res.status(400).send({
      status: "Failed",
      error: "No admins found!",
    });
  }

  res.send({
    admins,
  });
});

routes.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({
      status: "Failed",
      error: "Admin not found!",
    });
  }

  const admin = await AdminsModel.findById(id).select("-password");

  if (!admin) {
    return res.status(400).send({
      status: "Failed",
      error: "Admin not found!",
    });
  }

  res.send(admin);
});

// routes.patch('/change-site-info', authMiddleware, async (req, res) => {
//     const info = await PublicModel.create(req.body)
//     res.send(info)
// })

module.exports = routes;
