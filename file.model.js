module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("file", {
      fileName: {
        type: Sequelize.STRING
      },
      fileType: {
        type: Sequelize.STRING
      },
      fileData: {
        type: Sequelize.BLOB('long')  // Storing file as BLOB (binary data)
      }
    });
  
    return File;
  };
  
