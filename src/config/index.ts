import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path : path.join(process.cwd(), ".env")
})


export const config = {
    connection_string : process.env.CONNECTIONSTRING as string,
    port : process.env.PORT,
    secret: process.env.JWT_SECRET,
    jwt_access_expires_in :  process.env.JWT_ACCESS_EXPIRES_IN   as string,
}