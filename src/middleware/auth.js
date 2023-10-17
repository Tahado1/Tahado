//import  jwt  from "jsonwebtoken" 
import userModel from "../../DB/model/User.model.js"
import { expiresIn } from "../utils/GenerateAndVerifyToken.js"
import { systemRoles } from "../utils/systemRoles.js"



const auth = (accessRole)=>{
   return async(req,res,next)=>{
    try {
        if(!accessRole){
            accessRole = [systemRoles.USER , systemRoles.ADMIN , systemRoles.SUPER_ADMIN , systemRoles.SHOP]
        }
        const {authorization} = req.headers 
       /* if(!authorization){
            return next (new Error ("please log-in first" , {cause :400}))
        }*/
        if(!authorization?.startsWith(process.env.PREFIX_TOKEN)){
            return next (new Error ("In-valid bearer key" , {cause :400}))
        }
        const token = authorization.split(process.env.PREFIX_TOKEN)[1]

        if(!token){
            return next (new Error ("In-valid token" , {cause :400}))
        }
        const decoded = expiresIn({payload :token} )
        if(!decoded?._id){
            return next (new Error ("In-valid token payload" , {cause :400}))
        }
        /*console.log({
            tokenGeneratio : token.iat,
            reset: authUser.changePassword,
        });*/
        const authUser = await userModel.findById(decoded._id).select('userName email role')
        if(!authUser){
            return next (new Error ("Not register account" , {cause :400}))
        }
        if(!accessRole.includes(authUser.role)){
            return next (new Error ("Un-Authorized User" , {cause :400}))
        }
        req.user= authUser
        return next ()

    } catch (error) {
            return res.json({message:"catch Error" , err:error?.message})
    }
   }
}

export default auth