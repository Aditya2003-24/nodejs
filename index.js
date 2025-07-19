import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Routes/phoneroute.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));


app.use("/api",router)



mongoose
  .connect(process.env.DBCONNECTION)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });