const routes = require("express").Router();
const authMiddleware = require("../middlewares/authenticate");
const ImagesModel = require("../models/images");
const upload = require("../utils/multer");
const fs = require("fs");

routes.get("/", authMiddleware, async (req, res) => {
  let { page } = req.query;
  let { limit } = req.query;

  if (!page) {
    page = 1;
  }

  if (!limit) {
    limit = 9;
  }

  try {
    const startIndex = (Number(page) - 1) * Number(limit);

    const total = await ImagesModel.countDocuments({});
    const images = await ImagesModel.find()
      .sort({ _id: -1 })
      .limit(Number(limit))
      .skip(startIndex);

    if (!images) {
      return res.status(200).send({
        status: "Failed",
        error: "No images found",
      });
    }

    res.json({
      images,
      page: Number(page),
      numberOfPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      error: "Something went wrong",
    });
  }
});

routes.post(
  "/post",
  authMiddleware,
  upload.array("images"),
  async (req, res) => {
    if (!req.files) {
      return res.status(400).send({
        status: "Failed",
        error: "There is no file!",
      });
    }

    if (req.files.length <= 0) {
      return res.status(400).send({
        status: "Failed",
        error: "There is no file!",
      });
    }

    req.files.forEach((img) => {
      ImagesModel.create(
        { url: `${process.env.BACKEND_URL}/${img.filename}` },
        (err, result) => {
          if (err) {
            return res.status(400).send({
              status: "Failed",
              error: "Something went wrong",
            });
          }
        }
      );
    });

    try {
      res.status(200).send({
        status: "Success",
        uploaded: true,
        url: req.files,
      });
    } catch (error) {
      res.status(400).send({
        status: "Failed",
        error,
      });
    }
  }
);

routes.delete("/delete", authMiddleware, async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send({
      status: "Failed",
      error: "Something went wrong!",
    });
  }

  ImagesModel.findOneAndDelete({ url: image }, (err, result) => {
    if (err) {
      return res.status(400).send({
        status: "Failed",
        error: "Something went wrong!",
      });
    }
  });

  const backendLength = process.env.BACKEND_URL.length + 1;
  const urlLength = image.length - backendLength;
  const file_name = image.substr(backendLength, urlLength);
  const path = `./public/${file_name}`;

  if (fs.existsSync(path)) {
    fs.unlink(path, (err) => {});
  }

  try {
    return res.status(200).send({
      status: "Success",
    });
  } catch (error) {
    return res.status(200).send({
      status: "Failed",
      error,
    });
  }
});

module.exports = routes;
