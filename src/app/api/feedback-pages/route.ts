import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/bdConnect";
import FeedbackPageModel from "@/model/FeedbackPage";
import UserModel from "@/model/User";

// Create a new feedback page
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required", success: false },
        { status: 400 }
      );
    }

    // Find the user by username
    const user = await UserModel.findOne({ username: session.user.username });
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Generate a concise slug from title (limit to ~4 words)
    const generateConciseSlug = (title: string) => {
      // Split the title into words
      const words = title.split(/\s+/);
      
      // Take only the first 4 words (or fewer if the title is shorter)
      const truncatedWords = words.slice(0, 4);
      
      // Join the words and convert to slug format
      return truncatedWords
        .join("-")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/(^-|-$)+/g, "");
    };

    // Generate slug from title
    const slug = generateConciseSlug(title);

    // Check if a page with this slug already exists
    const existingPage = await FeedbackPageModel.findOne({ slug });
    if (existingPage) {
      // If slug exists, append a random string to make it unique
      const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
      
      const feedbackPage = await FeedbackPageModel.create({
        title,
        description,
        user: user._id,
        slug: uniqueSlug,
      });

      return NextResponse.json(
        { message: "Feedback page created", success: true, data: feedbackPage },
        { status: 201 }
      );
    }

    const feedbackPage = await FeedbackPageModel.create({
      title,
      description,
      user: user._id,
      slug,
    });

    return NextResponse.json(
      { message: "Feedback page created", success: true, data: feedbackPage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating feedback page:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// Get all feedback pages for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
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
    
    // Find all feedback pages for the user
    const pages = await FeedbackPageModel.find({ user: user._id })
      .select('title description slug isActive createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error("Error fetching feedback pages:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 