import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productosCollections = "product";

const productosSchema = new mongoose.Schema(
  {
    id: Number,
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    thumbnail: String,
    code: {
      type: String,
      unique: true,
      required: true,
    },
    stock: Number,
    owner:{
      type: mongoose.Types.ObjectId,
      ref: "usuarios",
      
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

productosSchema.plugin(paginate);

export const ProductosModels = mongoose.model(
  productosCollections,
  productosSchema
);

const cartCollection = "carts";
const cartSchema = new mongoose.Schema(
  {
    id: Number,
    products: {
      type: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: "product",
          },
          quantity: Number,
        },
      ],
    },
    total: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);



export const cartModel = mongoose.model(cartCollection, cartSchema);

const mensajesCollection = "messages";

const mensajesSchema = new mongoose.Schema(
  {
    user: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model(mensajesCollection, mensajesSchema);
