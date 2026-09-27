import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ProductRoutes from "./routes/productsRoute";
import AuthRoutes from "./routes/authRoute";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello From Sellify Backend");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);

const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGODB_URL) as string;
const PORT = process.env.PORT || 4000;

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`CONNECTED & RUNNING ON PORT: http://localhost:${PORT}`));
    })
    .catch((error) => {
        console.log(error);
    });
