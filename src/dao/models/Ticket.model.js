import mongoose from "mongoose";

export const ticketModel = mongoose.model(
  "ticket",
  new mongoose.Schema({
    code: { type: String, unique: true },
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
{
    timestamps:true
})
);
