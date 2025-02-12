import mongoose from "mongoose";

const connectDatabase = () => {
    console.log("Wait, connecting to the database");

    mongoose.connect("mongodb+srv://root:root@cluster0.5rine.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",)
        .then(() => console.log("Database connected"))
        .catch((error) => console.log(error));
};

export default connectDatabase;