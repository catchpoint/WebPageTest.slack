const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (process.env.ENVIRONMENT === "DEVELOPMENT") {
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }
  } catch (err) {
    console.info("Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
