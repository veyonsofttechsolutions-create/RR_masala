import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    buttonText: String,
    buttonLink: String,
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true },
);
export default mongoose.model("Banner", schema);
