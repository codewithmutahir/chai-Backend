import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDb from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env",
});

connectDb()

    .then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port ${process.env.PORT}`);
    });
    })
    .catch((err) => {
    console.log("MONGODB CONNECTION FAILED !!!", err)
    });
    (async () => {
    try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    } catch (error) {
    console.log("ERROR:", error);
    throw error;
    }
})();
