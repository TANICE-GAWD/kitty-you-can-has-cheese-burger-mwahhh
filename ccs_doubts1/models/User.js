import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true }, // hashed
	role: { type: String, enum: ["admin"], default: "admin" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
