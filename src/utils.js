import { fileURLToPath } from "url";
import { dirname, join } from "path";
import crypto from "crypto";
import bcrypt from 'bcrypt'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const CODE = "CODE";

/* export const generateHash = (password) => {
  const algorithm = "sha256";
  const hash = crypto
    .createHmac(algorithm, CODE)
    .update(password)
    .digest("hex");
  return hash;
}; */

export const generateHash =password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(password, passwordHash)=>bcrypt.compareSync(password,passwordHash)