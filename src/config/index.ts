import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: (process.env.CONNECTIONSTRING || process.env.DATABASE_URL) as string,
  port: process.env.PORT || "5000",
  secret: process.env.JWT_SECRET || "devpulse_secret",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  cors_origin: process.env.CORS_ORIGIN,
};

export default config;
