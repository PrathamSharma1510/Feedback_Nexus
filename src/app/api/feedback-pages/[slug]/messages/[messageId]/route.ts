import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/bdConnect";
import FeedbackPageModel from "@/model/FeedbackPage";
import MessageModel from "@/model/Message";
import UserModel from "@/model/User";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find the user by username
    const user = await UserModel.findOne({ username: session.user.username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find the feedback page and verify ownership
    const feedbackPage = await FeedbackPageModel.findOne({
      slug: params.slug,
      user: user._id,
    });

    if (!feedbackPage) {
      return NextResponse.json(
        { success: false, message: "Feedback page not found" },
        { status: 404 }
      );
    }

    console.log("Deleting message:", params.messageId, "from feedback page:", feedbackPage._id);

    // Delete the message
    const deletedMessage = await MessageModel.findOneAndDelete({
      _id: params.messageId,
      feedbackPage: feedbackPage._id,
    });

    if (!deletedMessage) {
      console.log("Message not found with ID:", params.messageId);
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    console.log("Message deleted successfully:", deletedMessage._id);

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 