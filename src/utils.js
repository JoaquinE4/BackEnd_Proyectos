import { fileURLToPath } from "url";
import { dirname, join } from "path";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const CODE = "CODE";

export const generaHasj = (code) =>
  crypto.createHmac("sha256", CODE).update(code).digest("hex");
