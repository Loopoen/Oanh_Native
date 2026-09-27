import mongoose, { Schema, Document, Model } from "mongoose";

export type ProductCategory =
    | "T-Shirts"
    | "Shirts"
    | "Hoodies"
    | "Sweatshirt"
    | "Jackets"
    | "Pants"
    | "Jeans"
    | "Shorts"
    | "Suits"
    | "Traditional Wear"
    | "Shoes"
    | "Accessories";

export interface IItemPrice {
    price: number;
    size: "S" | "M" | "L";
}

export interface IProduct extends Document {
    name: string;
    description: string;
    prices: IItemPrice[];
    average_rating: number;
    images: string[];
    brand?: string;
    category: ProductCategory;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const ItemPriceSchema = new Schema<IItemPrice>({
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        enum: ["S", "M", "L"],
        required: true,
    },
});

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        prices: {
            type: [ItemPriceSchema],
            required: true,
        },
        average_rating: {
            type: Number,
            default: 4.5,
        },
        images: {
            type: [String], 
            required: true,
        },
        brand: {
            type: String,
        },
        category: {
            type: String,
            enum: [
                "T-Shirts",
                "Shirts",
                "Hoodies",
                "Sweatshirt",
                "Jackets",
                "Pants",
                "Jeans",
                "Shorts",
                "Suits",
                "Traditional Wear",
                "Shoes",
                "Accessories",
            ],
            default: "T-Shirts",
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

const Products: Model<IProduct> = mongoose.model<IProduct>("Products", ProductSchema);

export default Products;
