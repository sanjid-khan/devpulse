import type { NextFunction, Request , Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[])=>{

    return async (req:Request, res: Response, next: NextFunction)=>{

        try{

            const token = req.headers.authorization;

            if(!token){

                res.status(401).json({
                    success:false,
                    message: "Unauthorized! No Token!! ",
                });
                return;
            }


            const decoded = jwt.verify(
                token,
                config.secret as string,
            ) as JwtPayload;


            const userData = await pool.query(
                `SELECT id, name, email, role FROM users WHERE id=$1`,
                [decoded.id]
            );


            if (userData.rows.length === 0) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized! User not found.",
                });
                return;
            }


             const user = userData.rows[0];


              if (roles.length && !roles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden! You do not have access.",
                });
                return;
            }

             req.user = decoded;
             next();

        } catch(error){
            next(error);
        }
    }
}


export default auth