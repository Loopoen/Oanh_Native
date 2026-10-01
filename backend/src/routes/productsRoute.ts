import express from "express";
import {
    getProducts,
    getProductByID,
    createProduct,
    deleteProductByID,
    updateProductByID,
} from "../controllers/productsController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();
 
router.get("/", getProducts);
router.get("/:id", getProductByID);
 
router.post("/", authenticateToken, createProduct);
 
router.delete("/:id", authenticateToken, deleteProductByID);
 
router.put("/:id", authenticateToken, updateProductByID);
 
export default router;
