import userModel from "../../../DB/model/User.model.js"

import bc from 'bcryptjs'
import { expiresIn, generateToken } from "../../utils/GenerateAndVerifyToken.js"
import sendEmail from "../../utils/sendEmail.js"
import { compare } from "../../utils/HashAndCompare.js"
import { customAlphabet } from "nanoid"
import multer from 'multer'
import bcrypt from 'bcrypt'
// import upload from '../../middleware/multer.js'
// import storage from '../../../cloudinary/index.js'
// import cloudinary from '../../../cloudinary/index.js'
// const upload = multer({ storage });


const nanoID = customAlphabet('123456789', 5)

// .......................................................


import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: 'dkmudrzws',
    api_key: '657177455687729',
    api_secret: 'nl7V4_fK-_f3WufQCeIlYuXMhqY'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Tahado', // Specify the folder where you want to upload images
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

const upload = multer({ storage: storage });

//==========================signUpUser=================
export const signUp = async (req, res, next) => {

    upload.single('image')(req, res, async function (err) {
        if (err) {
            return next(err);
        }

        const { userName, email, password, phone } = req.body;

        if (!req.file || !req.file.path) {
            return next(new Error('Image upload failed', { cause: 400 }));
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        const newUser = new userModel({
            userName,
            email,
            password,
            phone,
            image: {
                path: 'cloudinary://657177455687729:nl7V4_fK-_f3WufQCeIlYuXMhqY@dkmudrzws', // Set the image path to the Cloudinary URL
            },
        });

        const emailExist = await userModel.findOne({ email }).select('_id email');
        if (emailExist) {
            return next(new Error('Email already exists', { cause: 400 }));
        }

        await newUser.save();

        const token = generateToken({
            payload: {
                _id: newUser._id,
                email: newUser.email,
            },
        });

        if (!token) {
            return next(new Error('Token Generation Failed', { cause: 400 }));
        }

        const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmationEmail/${token}`;
        const message = `<a href=${confirmationLink}>Click to confirm</a>`;

        const sentEmail = await sendEmail({
            to: email,
            message,
            subject: 'Confirmation Email',
        });

        if (!sentEmail) {
            return next(new Error('Sending confirmation email failed', { cause: 400 }));
        }

        res.status(201).json({ message: 'Registration success, please confirm your email' });
    });

};
//===============================================signUpShop======================
export const signUpShop = async (req, res, next) => {
    upload.single('image')(req, res, async function (err) {
        if (err) {
            return next(err);
        }

        const { userName, email, phone, storeName, city, address, commercialRegister, password } = req.body;

        if (!req.file || !req.file.path) {
            return next(new Error('Image upload failed', { cause: 400 }));
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        const newUser = new userModel({
            userName,
            email,
            phone,
            password,
            storeName,
            city,
            address,
            commercialRegister,
            image: {
                path: 'cloudinary://657177455687729:nl7V4_fK-_f3WufQCeIlYuXMhqY@dkmudrzws', // Set the image path to the Cloudinary URL
            },
            role: 'Shop'
        });
        const emailExist = await userModel.findOne({ email }).select('_id email');
        if (emailExist) {
            return next(new Error('Email already exists', { cause: 400 }));
        }

        await newUser.save();

        const token = generateToken({
            payload: {
                _id: newUser._id,
                email: newUser.email,
            },
        });

        if (!token) {
            return next(new Error('Token Generation Failed', { cause: 400 }));
        }

        const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmationEmail/${token}`;
        const message = `<a href=${confirmationLink}>Click to confirm</a>`;

        const sentEmail = await sendEmail({
            to: email,
            message,
            subject: 'Confirmation Email',
        });

        if (!sentEmail) {
            return next(new Error('Sending confirmation email failed', { cause: 400 }));
        }

        res.status(201).json({ message: 'Registration success, please confirm your email' });
    });

};
//=============================================confirnationLink==============
export const confirmLink = async (req, res, next) => {
    const { token } = req.params;
    const decode = expiresIn({ payload: token });
    if (!decode?._id) {
        return next(new Error('token decode failed', { cause: 400 }));
    }
    const user = await userModel.findById(decode._id);
    if (user && !user.isConfirmed) {
        user.isConfirmed = true;
        await user.save();
    }

    if (!user) { // Change variable name to 'user' here
        return next(new Error('please check if you already confirmed, if not please sign up again', { cause: 400 }));
    }
    console.log(user);
    return res.status(200).json({ message: 'your email confirmed', decode });
};

//==============================================SignIn=====================================================
export const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, isConfirmed: true });
    console.log("Received email:", email);
    console.log("Received password:", password);
    console.log("Found user:", user);
    if (!user) {
        return next(new Error('Invalid email', { cause: 400 }));
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //     return next(new Error('Invalid login information', { cause: 400 }));
    // }
    const token = generateToken({
        payload: {
            _id: user._id,
            email: user.email,
            isLoggedIn: true
        }
    });
    const loggedInUser = await userModel.findOneAndUpdate({ _id: user._id }, { isLoggedIn: true });
    if (!loggedInUser) {
        return next(new Error('Please log in again', { cause: 400 }));
    }
    res.status(200).json({ message: "Login Done", token });
}

//================================send code ==========================
export const sendCode = async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email, isConfirmed: true })
    if (!user) {
        return next(new Error('please enter valid email', { cause: 400 }))
    }
    const forgetCode = nanoID()
    const message = `<p> OTP is ${forgetCode}</p>`
    const sentEmail = await sendEmail({
        to: email,
        message,
        subject: "Forget Password"
    })
    if (!sentEmail) {
        return next(new Error('send email service failed', { cause: 400 }))
    }
    const saved = await userModel.findOneAndUpdate({
        email
    }, {
        forgetCode
    }, {
        new: true
    })
    return res.status(200).json({ message: "OTP sent successfuly", saved })
}
//=====================================resetPassword==================

export const resetPaaword = async (req, res, next) => {
    const { email, forgetCode, newPassword } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error('in-valid email', { cause: 400 }))
    }
    if (user.forgetCode != forgetCode) {
        return next(new Error('in-valid OTP', { cause: 400 }))
    }
    user.forgetCode = null
    user.password = newPassword
    user.changePassword = Date.now()
    const userUpdateed = await user.save()
    return res.status(200).json({ message: "please logIn", userUpdateed })
}