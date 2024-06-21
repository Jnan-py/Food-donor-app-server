const usermodel = require('../models/usermodel');

module.exports = async(req,res,next)=>{
    try{
        const user = await usermodel.findById(req.body.userId);
        if(user?.role!=="Admin"){
            return res.status(401).send({
                success:false,
                message:"Auth Failed",
            });
        }else{
            next();
        }
    }catch(error){
        console.log(error);
        return res.status(401).send({
            success : false,
            message:"authorization failed",
            error,
        });
    }
};