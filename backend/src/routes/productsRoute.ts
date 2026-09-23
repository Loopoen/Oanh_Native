import express from "express";
import {
    getProducts,
    getProductByID,
    createProduct,
    deleteProductByID,
    updateProductByID,
} from "../controllers/productsController";

// initialize routes
const router = express.Router();

// get all products
router.get("/", getProducts);
// get single product. /api/products/12341234
router.get("/:id", getProductByID);

// create a new product
router.post("/", createProduct);

// delete a product
router.delete("/:id", deleteProductByID);

// update a product
router.put("/:id", updateProductByID);

// export
export default router;
