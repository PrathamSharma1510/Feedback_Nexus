import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/bdConnect";
import MessageModel from "@/model/Message";
import FeedbackPageModel from "@/model/FeedbackPage";
import UserModel from "@/model/User";

export async function GET(
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

    // Log the value for debugging
    console.log("Messages API - Feedback page isAcceptingMessages:", feedbackPage.isAcceptingMessages);

    // Get all messages for this feedback page
    const messages = await MessageModel.find({
      feedbackPage: feedbackPage._id,
    }).sort({ createdAt: -1 });

    // Add cache control headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

    return NextResponse.json(
      {
        message: "Messages retrieved",
        success: true,
        data: messages,
        pageTitle: feedbackPage.title,
        pageDescription: feedbackPage.description,
        isAcceptingMessages: feedbackPage.isAcceptingMessages === true
      },
      { 
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
} 