import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("freelance");
    const job = await db.collection("jobs").findOne({
      _id: new ObjectId(params.id),
    });
    return NextResponse.json(job);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}
