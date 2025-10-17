import mongoose, { Schema } from "mongoose";


const reactionSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const confessionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reactions: {
    love: { type: reactionSchema, default: () => ({}) },
    laugh: { type: reactionSchema, default: () => ({}) },
    sad: { type: reactionSchema, default: () => ({}) },
  },
  replies: [
    {
      text: String,
      replierEmail: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
},{versionKey: false});

export default mongoose.model("Confession", confessionSchema);
