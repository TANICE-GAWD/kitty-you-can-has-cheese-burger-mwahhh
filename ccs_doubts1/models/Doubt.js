import mongoose from "mongoose";

const DoubtSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	question: { type: String, required: true },
	credits: { 
		type: Number, 
		required: true, 
		min: 1, 
		max: 10 
	},
	status: {
		type: String,
		enum: ["pending", "accepted", "rejected"],
		default: "pending",
	},
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Doubt || mongoose.model("Doubt", DoubtSchema);
