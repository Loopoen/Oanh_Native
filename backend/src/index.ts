import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ProductRoutes from "./routes/productsRoute";

// initialize the express app
const app = express();

// middlewares & routes
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello From Sellify Backend");
});

// ....
app.use("/api/products", ProductRoutes);

// mongoDB atlas connection...
const MONGODB_URL = process.env.MONGODB_URL as string;
const PORT = process.env.PORT || 4000;

mongoose
    .connect(MONGODB_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`CONNECTED & RUNNING ON PORT: http://localhost:${PORT}`));
    })
    .catch((error) => {
        console.log(error);
    });
