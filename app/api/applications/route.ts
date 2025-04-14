import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("freelance");
    const applications = await db.collection("applications").find({}).toArray();
    return NextResponse.json(applications);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("freelance");
    const result = await db.collection("applications").insertOne(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
