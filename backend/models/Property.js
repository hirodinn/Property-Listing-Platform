import mongoose from "mongoose";

const propertySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "pending", "published", "archived"],
      default: "draft",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Query Middleware to exclude soft-deleted documents by default
// Query Middleware to exclude soft-deleted documents by default
propertySchema.pre(/^find/, function () {
  if (this.options.includeDeleted) {
    return;
  }
  this.where({ deletedAt: null });
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
