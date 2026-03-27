import mongoose from "mongoose";

const connectedDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Connected to database"),
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/popculturequest`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectedDB;
