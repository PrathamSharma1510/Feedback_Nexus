import { NextResponse } from "next/server";
import dbConnect from "@/lib/bdConnect";
import MessageModel from "@/model/Message";
import FeedbackPageModel from "@/model/FeedbackPage";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { content, feedbackPageSlug } = body;

    if (!content || !feedbackPageSlug) {
      return NextResponse.json(
        { message: "Content and feedback page slug are required", success: false },
        { status: 400 }
      );
    }

    // Find the feedback page by slug
    const feedbackPage = await FeedbackPageModel.findOne({
      slug: feedbackPageSlug,
      isActive: true,
    });

    if (!feedbackPage) {
      return NextResponse.json(
        { message: "Feedback page not found", success: false },
        { status: 404 }
      );
    }

    // Check if the feedback page is accepting messages
    if (feedbackPage.isAcceptingMessages !== true) {
      return NextResponse.json(
        { message: "This feedback page is not accepting messages at the moment", success: false },
        { status: 403 }
      );
    }

    // Get the user who owns the feedback page
    const user = await UserModel.findById(feedbackPage.user);
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Create a new message
    const message = await MessageModel.create({
      content,
      feedbackPage: feedbackPage._id,
      user: user._id, // Set the user field to the feedback page owner
    });

    return NextResponse.json(
      { message: "Message sent successfully", success: true, data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}