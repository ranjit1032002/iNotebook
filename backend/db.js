const mongoose = require("mongoose");

const mongooseURI = "mongodb://localhost:27017/inotebook";

const connectToDB = async () => {
  try {
    mongoose.connect(mongooseURI, () => {
      console.log("Connection established");
    });
  } catch (e) {
    console.log("Connection error" + e);
  }
};

module.exports = connectToDB;
