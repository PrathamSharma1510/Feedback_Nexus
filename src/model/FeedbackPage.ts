import mongoose from "mongoose";

const feedbackPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug from title if not provided
feedbackPageSchema.pre("save", function (next) {
  if (!this.slug) {
    // Generate a concise slug from title (limit to ~4 words)
    const words = this.title.split(/\s+/);
    const truncatedWords = words.slice(0, 4);
    
    this.slug = truncatedWords
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const FeedbackPageModel =
  mongoose.models.FeedbackPage ||
  mongoose.model("FeedbackPage", feedbackPageSchema);

export default FeedbackPageModel; 