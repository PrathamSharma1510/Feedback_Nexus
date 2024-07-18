import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams);
    const USNAME = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(USNAME);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
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
      console.log(User);
      return Response.json(
        { message: "UserName already exists" },
        { status: 200 }
      );
    }
    return Response.json({ message: "UserName is unique" }, { status: 200 });
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json({
      message: "Server error checking Username",
    });
  }
}
