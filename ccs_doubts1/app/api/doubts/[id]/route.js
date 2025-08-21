import { connectDB } from "../../../../lib/mongodb.js";
import Doubt from "../../../../models/Doubt.js";

export async function PATCH(req, { params }) {
	await connectDB();
	const { status } = await req.json();
	const updated = await Doubt.findByIdAndUpdate(
		params.id,
		{ status },
		{ new: true }
	);
	return Response.json(updated);
}
