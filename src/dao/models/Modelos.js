import mongoose from "mongoose";
import  paginate  from "mongoose-paginate-v2";

const productosCollections = "product"

const productosSchema = new mongoose.Schema( 
    {
        id: Number,
        title: { type: String, required: true },
        description: String,
        price: Number,
        thumbnail: String,
        code: {
            type: String,
            unique: true,
            required: true
        },
        stock: Number,


    },
    {
        timestamps: true

    }
)

productosSchema.plugin(paginate);

export const ProductosModels = mongoose.model(
    productosCollections,
    productosSchema
)



const cartCollection = "carts"
const cartSchema = new mongoose.Schema({


    id: Number,
    products:{type:[{

        product:{
            type: mongoose.Types.ObjectId,
            ref: "product"
        },
        quantity: Number

    }]

}}, {
    timestamps: true
}

)

export const cartModel = mongoose.model(
    cartCollection,
    cartSchema
)

const mensajesCollection = "messages"

const mensajesSchema = new mongoose.Schema({

    user: String,
    message: String

},
    {
        timestamps: true
    }

)

export const MessageModel = mongoose.model(
    mensajesCollection,
    mensajesSchema
)