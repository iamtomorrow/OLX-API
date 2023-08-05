
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    state: String,
    date_created: String,
    hash_password: String,
    token: String
})

export const User = mongoose.model("User", UserSchema);
