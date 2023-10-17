import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const signUp = Joi.object({
    userName: Joi.string().min(3).max(20).required().alphanum(),
    email:generalFields.email,
    password:generalFields.password,
    phone:Joi.number().optional(),
}).required()
