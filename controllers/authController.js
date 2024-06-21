const usermodel = require("../models/usermodel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { use } = require("../routes/authRoutes");

const registerController = async (req,res) => {
    try {
        const existingUser = await usermodel.findOne({email:req.body.email});
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"User Already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        req.body.password = hashedPassword;

        const user  = new usermodel(req.body);
        await user.save();
        return res.status(201).send({
            success:true,
            message:"User Registered successfully",
            user,
        });

    }catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message:'Error in Register API',
            error
        });
    }
};

const loginController = async (req,res) => {
    try{
        const user = await usermodel.findOne({email:req.body.email});
        if (!user){
            return res.status(404).send({
                success:false,
                message : "User Not found",
            });
        }
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword){
            return res.status(500).send({
                success: false,
                message: "Invalid Credentials",
            });
        }
        if(user.role !== req.body.role){
            return res.status(500).send({
                success:false,
                message:"Role does not Match",
            });
        }
        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET,{expiresIn:'1d'});
        return res.status(200).send({
            success:true,
            message:'Login Successfully',
            token,
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message : 'Error in Login Api',
            error
        })
    }
};

const currentUserController = async (req,res) => {
    try{
        const user = await usermodel.findOne({_id:req.body.userId});
        return res.status(200).send({
            success:true,
            message:"User Found Successfully",
            user, 
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Unable to get the Current User",
            error,
        });
    }
};

module.exports = { registerController, loginController, currentUserController};