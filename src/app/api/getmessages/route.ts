import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/bdConnect";
import MessageModel from "@/model/Message";
import FeedbackPageModel from "@/model/FeedbackPage";
import UserModel from "@/model/User";

export async function GET(request: Request) {
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

    // Get all feedback pages for the user
    const feedbackPages = await FeedbackPageModel.find({
      user: user._id,
    });

    if (!feedbackPages.length) {
      return NextResponse.json(
        { message: "No feedback pages found", success: true, data: [] },
        { status: 200 }
      );
    }

    const feedbackPageIds = feedbackPages.map((page) => page._id);

    // Get all messages for the user's feedback pages
    const messages = await MessageModel.find({
      feedbackPage: { $in: feedbackPageIds },
    })
      .populate("feedbackPage", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Messages retrieved", success: true, data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}