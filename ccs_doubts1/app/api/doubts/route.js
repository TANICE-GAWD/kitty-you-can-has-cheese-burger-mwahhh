import { connectDB } from "../../../lib/mongodb";
import Doubt from "../../../models/Doubt";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, question, credits } = await req.json();
    const doubt = await Doubt.create({ name, email, question, credits, status: "pending" });
    return new Response(JSON.stringify(doubt), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    let doubts;

    if (status) {
      doubts = await Doubt.find({ status });
    } else {
      doubts = await Doubt.find({});
    }

    return new Response(JSON.stringify(doubts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
