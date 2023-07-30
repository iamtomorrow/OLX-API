
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: String,
    slug: String
})

export const Category = mongoose.model("Category", CategorySchema);
