const db = require("../models");
const File = db.files;
const path = require('path');

// Upload file to MySQL
const uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, buffer } = req.file;

    await File.create({
      fileName: originalname,
      fileType: mimetype,
      fileData: buffer,
    });

    res.status(200).send("File uploaded successfully.");
  } catch (err) {
    res.status(500).send({
      message: "Could not upload the file: " + err.message,
    });
  }
};


const listFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      attributes: ['id', 'fileName', 'fileType', 'createdAt']
    });

    if (!files || files.length === 0) {
      return res.status(404).send({
        message: "No files found."
      });
    }

    res.status(200).json(files);
  } catch (err) {
    res.status(500).send({
      message: "Could not retrieve files: " + err.message,
    });
  }
};




// Download file from MySQL
const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);

    if (!file) {
      return res.status(404).send({
        message: "File not found."
      });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${file.fileName}`);
    res.setHeader('Content-Type', file.fileType);
    res.send(file.fileData);
  } catch (err) {
    res.status(500).send({
      message: "Could not download the file: " + err.message,
    });
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  listFiles, // Export the new method
};
