import mongoose from "mongoose";

export const usuarioModelo = mongoose.model(
  "usuarios",
  new mongoose.Schema(
    {
      user: String,
      email: {
        type: String,
        unique: true,
      },
      password: String,
      rol: String,
      cart: {
        type: mongoose.Types.ObjectId,
        ref: "carts",
      },
    },
    { timestamps: true, strict: false }
  )
);
