export class UserModel{
    static async create(adminId:number, account_type:string, username:string, password:string){
        //register
        if(account_type==="user"){
            //give adminId in query
        } else {
            //do not give adminId in query
        }
    }


    static async get(username:string, password:string) :Promise<any>{
        //compare given password with db's hashed password, if correct then return user
        //return user
        return {
            success:false,
            message:"Invalid credentials"
        }
    }

    static async getById(id:number):Promise<any>{
        return {
            success:false,
            message:"User does not exist"
        }
        return null
    }


}