import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    dbConnect();
    const {messageId,username} = await request.json();
    try {
        // Find the user by username and remove the message by messageID
        const updatedUser = await UserModel.findOneAndUpdate(
          { username },
          {
            $pull: { messages: { _id: messageId } },
          },
          { new: true } // This option returns the updated document
        );
      
        if (!updatedUser) {
          return Response.json(
            {
              success: false,
              message: "Username does not exist",
            },
            { status: 400 }
          );
        }
      
        return Response.json(
          {
            success: true,
            message: "Message deleted successfully",
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json(
          {
            success: false,
            message: "An error occurred while deleting the message",
          },
          { status: 500 }
        );
    }
}