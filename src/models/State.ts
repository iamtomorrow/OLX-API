
import mongoose from "mongoose";

const StateSchema = new mongoose.Schema({
    name: String,
    slug: String
})

export const State = mongoose.model("State", StateSchema );
