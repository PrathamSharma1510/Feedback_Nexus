import { NextResponse } from "next/server";
import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ username: params.username });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Only return non-sensitive information
    return NextResponse.json({
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      socialLinks: user.socialLinks,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Error fetching profile" },
      { status: 500 }
    );
  }
} 