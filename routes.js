const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileController = require("../newtn/controllers/file.controller");

const upload = multer({ storage: multer.memoryStorage() });

let routes = (app) => {
  router.post("/upload", upload.single("file"), fileController.uploadFile);
  router.get("/download/:id", fileController.downloadFile);

  app.use("/api/files", router);
};

module.exports = routes;
