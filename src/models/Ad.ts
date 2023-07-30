
import mongoose from "mongoose";

export interface AdProps {
    name: string,
    id_user: string,
    state: string,
    category: string,
    price: string,
    price_negotiable: boolean,
    description: string,
    views: number,
    status: string,
    date_created: string,
    images: [object]
}

const AdSchema = new mongoose.Schema({
    name: String,
    id_user: String,
    state: String,
    category: String,
    price: String,
    price_negotiable: Boolean,
    description: String,
    views: Number,
    status: String,
    date_created: String,
    images: [Object]
})

export const Ad = mongoose.model("Ad", AdSchema);
