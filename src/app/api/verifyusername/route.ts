import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server"; // Ensure you have this import for proper response handling
import dbConnect from "@/lib/bdConnect";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const USNAME = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(USNAME);
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const User = await UserModel.findOne({
      username: username,
      isVerified: true,
    });
    if (User) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      {
        message: "Server error checking username",
      },
      { status: 500 }
    );
  }
}
