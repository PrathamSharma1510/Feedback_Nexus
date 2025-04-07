import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/bdConnect";
import FeedbackPageModel from "@/model/FeedbackPage";
import UserModel from "@/model/User";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find the user by username
    const user = await UserModel.findOne({ username: session.user.username });
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Find the feedback page by slug and user
    const feedbackPage = await FeedbackPageModel.findOne({
      slug: params.slug,
      user: user._id,
    });

    if (!feedbackPage) {
      return NextResponse.json(
        { message: "Feedback page not found", success: false },
        { status: 404 }
      );
    }

    // Log the current value for debugging
    console.log("Current isAcceptingMessages:", feedbackPage.isAcceptingMessages);

    // Ensure isAcceptingMessages is a boolean
    const currentValue = feedbackPage.isAcceptingMessages === true;
    
    // Toggle the isAcceptingMessages field
    feedbackPage.isAcceptingMessages = !currentValue;
    
    // Log the new value for debugging
    console.log("New isAcceptingMessages:", feedbackPage.isAcceptingMessages);
    
    // Save the changes
    await feedbackPage.save();

    // Set cache control headers to prevent caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    // Return a simplified response with just the success status and the new value
    return NextResponse.json(
      {
        success: true,
        message: `Messages are now ${feedbackPage.isAcceptingMessages ? "accepted" : "not accepted"}`,
        isAcceptingMessages: feedbackPage.isAcceptingMessages
      },
      { 
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Error toggling message acceptance:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
} 