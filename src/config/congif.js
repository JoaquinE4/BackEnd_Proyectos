import dotenv from "dotenv"
import {Command, Option} from "commander"

let programa=new Command()

programa.addOption(new Option("-m, --mode <modo>", "Mode de ejecución del script").choices(["dev", "prod"]).default("dev"))

programa.parse()
const argumentos=programa.opts()

const mode=argumentos.mode
dotenv.config(
    {
        path: mode==="prod"?"./.env.production":"./.env.development",
        override: true
    }
)

export const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_URL_DB: process.env.MONGO_URL_DB,
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET,
    DEBUG:process.env.DEBUG,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    ADMIN_ID: process.env.ADMIN_ID
};