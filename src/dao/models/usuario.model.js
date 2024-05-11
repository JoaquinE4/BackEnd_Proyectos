import mongoose from "mongoose";

export const usuarioModelo = mongoose.model(
  "usuarios",
  new mongoose.Schema({
    user: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
  })
);
