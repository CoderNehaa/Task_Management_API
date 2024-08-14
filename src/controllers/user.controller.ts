import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserController{
    async register(req:Request, res:Response){
        try{
            const adminId = parseInt(req.params.adminId);
            const {account_type, username, password} = req.body;
            if(account_type === "user"){
                if(!adminId){
                    return res.status(400).send({
                        success:false,
                        message:"Admin ID is required while creating user/team member account"
                    })   
                }

                const adminExists = await UserModel.getById(adminId);
                if(!adminExists.success){
                    return res.status(400).send({
                        success:false,
                        message:"No account exists with this admin Id. Enter valid id"
                    })  
                }
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);
            UserModel.create(adminId, account_type, username, hashedPassword);
            return res.status(200).send({
                success:true,
                message:"User Registered successfully"
            });
        } catch (e){
            console.log(e);
            return res.status(500).send({
                success:false,
                message:"Failed to register user! Try later"
            })   
        }
    }

    async signin(req:Request, res:Response){
        try{
            const {account_type, username, password} = req.body;
            const user  = await UserModel.get(username, password);
            if(!user.success){
                return res.status(400).send({
                    success:false,
                    message:"Invalid credentials"
                })
            }

            const token = jwt.sign({ userId: user.id, username: user.username }, "WG6oqviIhVwcCJKY1ZI5G0NKnaTB5uYb", {
                expiresIn: "1h",
            });
            return res.status(200).send({
                success:true,
                data:user,
                message:"Signed in successfully",
                token:token
            })
        } catch (e){
            console.log(e);
            return res.status(500).send({
                success:false,
                message:"Failed to register user! Try later"
            })   
        }
    }
    
}

