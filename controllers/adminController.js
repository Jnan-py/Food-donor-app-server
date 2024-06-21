const usermodel = require("../models/usermodel");

const getDonorsListController = async(req,res) =>{
    try{
        const donorData = await usermodel.find({role:"Donor"}).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            TotalCount:donorData.length,
            message:"Donor List got successfully",
            donorData,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Donor List API",
            error,
        });
    }
};

const getTrustsListController = async(req,res) =>{
    try{
        const trustData = await usermodel.find({role:"CharitableTrusts"}).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            TotalCount : trustData.length,
            message:"Trust List got successfully",
            trustData,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Trust List API",
            error,
        });
    }
};

const getOrgListController = async(req,res) =>{
    try{
        const orgData = await usermodel.find({role:"Organisation"}).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            TotalCount : orgData.length,
            message:"Organisations List got successfully",
            orgData,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Organisation List API",
            error,
        });
    }
};

const deleteDonor = async(req,res)=>{
    try{
        await usermodel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success:true,
            message:"Donor Deleted Successfully", 
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error while deleting donor",
            error,
        });
    }
};

const deleteTrust = async(req,res)=>{
    try{
        await usermodel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success:true,
            message:"Trust Deleted Successfully", 
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error while deleting Trust",
            error,
        });
    }
};

const deleteOrg = async(req,res)=>{
    try{
        await usermodel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success:true,
            message:"Organisation Deleted Successfully", 
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error while deleting Organisation",
            error,
        });
    }
};

module.exports= {getDonorsListController,getTrustsListController,getOrgListController,deleteDonor, deleteTrust, deleteOrg};