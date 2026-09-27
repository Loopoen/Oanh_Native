import express from "express";
import {
    getProducts,
    getProductByID,
    createProduct,
    deleteProductByID,
    updateProductByID,
} from "../controllers/productsController";

const router = express.Router();
 
router.get("/", getProducts);
router.get("/:id", getProductByID);
 
router.post("/", createProduct);
 
router.delete("/:id", deleteProductByID);
 
router.put("/:id", updateProductByID);
 
export default router;
