const routes = require("express").Router();
const messagesModel = require("../models/messages");
const authMiddleware = require("../middlewares/authenticate");
const mongoose = require("mongoose");

routes.get("/", authMiddleware, async (req, res) => {
  const messages = await messagesModel.find();

  res.send(messages);
});

routes.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({
      status: "Failed",
      error: "Massage not found!",
    });
  }

  const massage = await messagesModel.findById(id);

  if (!massage) {
    return res.status(400).send({
      status: "Failed",
      error: "Massage not found!",
    });
  }

  res.send(massage);
});

routes.post("/send", (req, res) => {
  const { email, text, phone } = req.body;

  const emailRegx =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email) {
    return res.status(400).send({
      status: "Failed",
      error: "Email is empty!",
    });
  }

  if (!phone) {
    return res.status(400).send({
      status: "Failed",
      error: "Phone is empty!",
    });
  }

  if (!email.match(emailRegx)) {
    return res.status(401).send({
      status: "Failed",
      error: "Bad Email!",
    });
  }

  if (!text) {
    return res.status(400).send({
      status: "Failed",
      error: "Text is empty!",
    });
  }

  messagesModel.create({ email, text }, (err, result) => {
    if (err) {
      return res.status(400).send({
        status: "Failed",
        error: "Something went wrong!",
      });
    }
  });

  res.send("Success");
});

routes.post("/answer", authMiddleware, (req, res) => {
  const { id } = req.body;

  messagesModel.findByIdAndUpdate(id, { answered: true }, (err, result) => {
    if (err) {
      return res.status(400).send({
        status: "Failed",
        error: "Something went wrong!",
      });
    }
  });

  res.send("Success");
});

module.exports = routes;
