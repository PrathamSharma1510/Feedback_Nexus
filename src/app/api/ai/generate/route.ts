import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMessageContent, AIMessageOptions } from "@/lib/ai-service";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

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
    const { prompt, options } = body;

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    const messageOptions: AIMessageOptions = options || {};
    const generatedContent = await generateMessageContent(prompt, messageOptions);

    return NextResponse.json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error("Error generating message content:", error);
    return NextResponse.json(
      { success: false, message: "Error generating message content" },
      { status: 500 }
    );
  }
} 