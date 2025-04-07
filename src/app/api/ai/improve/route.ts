import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { improveMessage, AIMessageOptions } from "@/lib/ai-service";

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
    const { message, options } = body;

    if (!message) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 }
      );
    }

    const messageOptions: AIMessageOptions = options || {};
    const improvedContent = await improveMessage(message, messageOptions);

    return NextResponse.json({
      content: improvedContent,
    });
  } catch (error) {
    console.error("Error improving message:", error);
    return NextResponse.json(
      { message: "Error improving message" },
      { status: 500 }
    );
  }
} 