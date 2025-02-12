import mongoose from "mongoose";

const connectDatabase = () => {
    console.log("Wait, connecting to the database");

    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("Database connected"))
        .catch((error) => console.log(error));
};

export default connectDatabase;