import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateReplySuggestions } from "@/lib/ai-service";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, count } = body;

    if (!message) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 }
      );
    }

    const replyCount = count || 3;
    const suggestions = await generateReplySuggestions(message, replyCount);

    return NextResponse.json({
      suggestions,
    });
  } catch (error) {
    console.error("Error generating reply suggestions:", error);
    return NextResponse.json(
      { message: "Error generating reply suggestions" },
      { status: 500 }
    );
  }
} 