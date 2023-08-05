
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    _id: String,
    name: String,
    slug: String
})

export const Category = mongoose.model("Category", CategorySchema);
