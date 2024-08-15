import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { CustomError } from "../utils/custom-error";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export class UserController{
    async register(req:Request, res:Response, next:NextFunction){
        try{
            const {account_type, username, password, adminId} = req.body;
            
            if(account_type === "user"){
                if(!adminId || typeof adminId !== "number"){ 
                    throw new CustomError(400, "Admin ID is required while creating user/team member account")
                }

                const adminExists = await UserModel.getById(adminId);
                if(!adminExists.success){
                    throw new CustomError(400, 'No account exists with this admin ID. Enter a valid ID');
                }
            }

            //username already exists
            const usernameExists = await UserModel.usernameExists(username);
            if(usernameExists){
                throw new CustomError(400, 'Username already exists. Try a different username.');
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);
            UserModel.create(adminId, account_type, username, hashedPassword);
            return res.status(200).send({
                success:true,
                message:"User Registered successfully"
            });
        } catch (e){
            next(e);
        }
    }

    async signin(req:Request, res:Response, next:NextFunction){
        try{
            const {username, password} = req.body;
            const data:any = await UserModel.get(username, password);
            if(!data.success){
                throw new CustomError(400, data.message);
            }
            const {user} = data;
            
            const token = jwt.sign({ userId: user.id, username: user.username }, "Dbx6aLgGlUXrK7VedFSDOL1bbuIZN0VY", {
                expiresIn: "1h",
            });
            return res.status(200).send({
                success:true,
                data:user,
                message:"Signed in successfully",
                token:token
            })
        } catch (e){
            next(e);
        }
    }
    
}

