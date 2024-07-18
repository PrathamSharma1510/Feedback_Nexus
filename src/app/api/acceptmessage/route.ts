import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userid = user?._id;
  const { acceptMessage } = await request.json();

  try {
    // Assuming 'userid' is defined somewhere in your code and is valid
    const user = await UserModel.findByIdAndUpdate(
      userid,
      {
        isAcceptingMessages: acceptMessage,
      },
      { new: true }
    );

    if (!user) {
      console.log("Was not able to update user");
      return Response.json(
        {
          success: true,
          message: "Failed to update status",
          acceptMessage: acceptMessage,
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Status was updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Failed to update status",
      },
      {
        status: 401,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userid = user?._id;

  try {
    const gotUser = await UserModel.findById(userid);
    if (!gotUser) {
      console.log("Was not able to Find user");
      return Response.json(
        {
          success: false,
          message: "Was not able to Find user",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: gotUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        status: false,
        message: "problem with finding user",
      },
      {
        status: 401,
      }
    );
  }
}
