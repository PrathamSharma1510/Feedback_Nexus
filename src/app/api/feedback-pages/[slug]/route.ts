import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/bdConnect";
import FeedbackPageModel from "@/model/FeedbackPage";
import UserModel from "@/model/User";

// Get a specific feedback page
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const feedbackPage = await FeedbackPageModel.findOne({
      slug: params.slug,
      isActive: true,
    }).populate("user", "username");

    if (!feedbackPage) {
      return NextResponse.json(
        { message: "Feedback page not found", success: false },
        { status: 404 }
      );
    }

    // Convert to plain object and ensure isAcceptingMessages is included
    const feedbackPageObj = feedbackPage.toObject();
    
    // If isAcceptingMessages is undefined, set it to true
    if (feedbackPageObj.isAcceptingMessages === undefined) {
      feedbackPageObj.isAcceptingMessages = true;
    }

    // Set cache control headers to prevent caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return NextResponse.json(
      { message: "Feedback page retrieved", success: true, data: feedbackPageObj },
      { 
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Error retrieving feedback page:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// Update a feedback page
export async function PUT(
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
    
    const body = await request.json();
    const { title, description, isActive, isAcceptingMessages } = body;

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

    if (title) feedbackPage.title = title;
    if (description) feedbackPage.description = description;
    if (typeof isActive === "boolean") feedbackPage.isActive = isActive;
    if (typeof isAcceptingMessages === "boolean") feedbackPage.isAcceptingMessages = isAcceptingMessages;

    await feedbackPage.save();
    
    // Set cache control headers to prevent caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return NextResponse.json(
      { message: "Feedback page updated", success: true, data: feedbackPage },
      { 
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Error updating feedback page:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// Delete a feedback page
export async function DELETE(
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
    
    const feedbackPage = await FeedbackPageModel.findOneAndDelete({
      slug: params.slug,
      user: user._id,
    });

    if (!feedbackPage) {
      return NextResponse.json(
        { message: "Feedback page not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Feedback page deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting feedback page:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
} 