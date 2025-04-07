import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedbackPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackPage",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default MessageModel; 