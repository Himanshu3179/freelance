import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("freelance");
    const jobs = await db.collection("jobs").find({}).toArray();
    return NextResponse.json(jobs);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("freelance");
    const result = await db.collection("jobs").insertOne(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
