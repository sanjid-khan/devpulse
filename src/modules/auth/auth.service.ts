import bcrypt from "bcryptjs";
import { pool } from "../../db";
import { config } from "../../config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ISignup ,ILogin} from "./auth.interface";


const signupUserIntoDB = async (payload : ISignup)=>{

     const  { name, email, password, role } = payload;


     if (!["contributor", "maintainer"].includes(role)) 
        {
        throw new Error("Invalid role! Must be contributor or maintainer.");
        }


     const existingUser = await pool.query(
         `
        SELECT * FROM users WHERE email =$1
        `,
        [email]
     );


     if(existingUser.rows.length > 0){
        throw  new Error ("Email already registered!!");
     }

     const hashPassword = await bcrypt.hash(password,10);

     const result = await pool.query(
        `INSERT INTO users(name, email, password, role)
         VALUES($1, $2, $3, $4)
         RETURNING * `,
        [name, email, hashPassword, role ]
    );

     delete result.rows[0].password;
     return result.rows[0];
}


const loginUserIntoDB = async(payload: ILogin)=>{

    const { email,password } = payload;

    const userData = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    );

    if(userData.rows.length === 0 ){
        throw new Error ( "Invalid credentials!!");
    }


     const user = userData.rows[0];

     const matchPassword = await bcrypt.compare(password, user.password);

     if(!matchPassword){
         throw new Error("Invalid Credentials!")
     }


     const jwtpayload ={
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }


      const token = jwt.sign(
        jwtpayload,
        config.secret as string,
        { expiresIn : config.jwt_access_expires_in as any}
      )
      
      delete user.password;

      return { token, user };
}


export const authService = {
    signupUserIntoDB,
    loginUserIntoDB
}


