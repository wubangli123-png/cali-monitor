import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/fetchNews";

export const revalidate = 1800; // 30 minutes

export async function GET() {
  try {
    const data = await fetchAllNews();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/news] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
