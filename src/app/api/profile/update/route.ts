import { NextResponse } from "next/server";
import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const username = formData.get("username") as string;
    
    // Verify that the user is updating their own profile
    if (username !== session.user?.username) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Handle profile picture upload
    const profilePicture = formData.get("profilePicture") as File | null;
    let profilePictureUrl = user.profilePicture;

    if (profilePicture) {
      try {
        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a unique filename
        const filename = `${username}-${Date.now()}.${profilePicture.name.split('.').pop()}`;
        const path = join(process.cwd(), "public", "uploads", filename);
        
        // Save the file using a different approach
        await writeFile(path, buffer as any);
        
        // Update the profile picture URL
        profilePictureUrl = `/uploads/${filename}`;
      } catch (error) {
        console.error("Error saving profile picture:", error);
        // Continue without updating the profile picture
      }
    }

    // Update user profile
    user.displayName = formData.get("displayName") as string || user.displayName;
    user.bio = formData.get("bio") as string || user.bio;
    user.profilePicture = profilePictureUrl;
    
    // Update social links
    user.socialLinks = {
      twitter: formData.get("twitter") as string || user.socialLinks?.twitter,
      github: formData.get("github") as string || user.socialLinks?.github,
      website: formData.get("website") as string || user.socialLinks?.website,
    };

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
} 