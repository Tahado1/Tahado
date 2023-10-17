import { Router } from "express";
import * as controllers from './auth.controller.js'
const router = Router()
import { fileUpload } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './auth.validation.js'

router.post("/signUp",asyncHandler(controllers.signUp))
router.post("/signUpShop",asyncHandler(controllers.signUpShop))
router.get("/confirmationEmail/:token",asyncHandler(controllers.confirmLink))
router.post("/logIn",asyncHandler(controllers.logIn))
router.get("/sendCode",asyncHandler(controllers.sendCode))
router.put("/resetPassword",asyncHandler(controllers.resetPaaword))



export default router 