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

app.get("/health", (req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/api", (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: "Database is not connected yet. Please try again shortly." });
    }
    next();
});

app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);

const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGODB_URL) as string;
const PORT = Number(process.env.PORT) || 5000;

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })


app.listen(PORT, "0.0.0.0", () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}  ->  http://localhost:${PORT}/health`);
});

