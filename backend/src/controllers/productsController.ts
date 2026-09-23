import { Request, Response } from "express";
import mongoose from "mongoose";
import Products from "../models/productModel";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Products.find().sort({ createdAt: -1 });
        // logic here...
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getProductByID = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const id = req.params.id as string;
  
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Not a valid ID" });
        }
        const product = await Products.findById(id);

        if (!product) {
            return res.status(404).json({ error: "No such product" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const createProduct = async (req: Request, res: Response): Promise<Response | void> => {
    const {
        name,
        description,
        images,
        prices,
        brand,
        average_rating,
        category,
        quantity,
    } = req.body;
    try {
        // check if required fields is here
        if (!name || !description || !images || !prices || !brand) {
            return res.status(400).json({ error: "Missing Required Fields" });
        }
 
        const product = await Products.create({
            name,
            description,
            images,
            prices,
            brand,
            average_rating,
            category,
            quantity,
        });
    } catch (error) {
        console.error("couldn't create the product", error);

        res.status(500).json(error);
    }
};

export const deleteProductByID = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const id = req.params.id as string;
   
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Not a valid ID" });
        }
        const product = await Products.findByIdAndDelete(id);
        // check if not found
        if (!product) {
            return res.status(404).json({ error: "No such product" });
        }
        res.status(200).json({ msg: `Product Deleted Successfully: ${id}`, product });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateProductByID = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const id = req.params.id as string;
  
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Not a valid ID" });
        }
        const product = await Products.findByIdAndUpdate(id, { ...req.body }, { new: true });
        console.log("id: ", id, product, { ...req.body });

        // check if not found
        if (!product) {
            return res.status(404).json({ error: "No such product" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
};
