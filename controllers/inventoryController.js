const usermodel = require("../models/usermodel");
const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");

const createInventoryController = async (req,res) => {
    try{
        const {email} = req.body;
        const user = await usermodel.findOne({email});
        if(!user){
            throw new Error('User Not Found');
        }

        if(req.body.inventoryType=='Delivered'){
            const requestedFoodType = req.body.foodType;
            const requestedQuantityofFood = req.body.quantity;
            const Organisation = new mongoose.Types.ObjectId(req.body.userId);

            const totalInOfRequestedFood = await inventoryModel.aggregate([
                {$match:{
                    Organisation,
                    inventoryType:'Donated',
                    foodType:requestedFoodType
                    },
                },
                {
                    $group:{
                        _id:'$foodType',
                        total :{$sum : '$quantity'}
                    },
                },
            ]);
            // console.log('Total Received' , totalInOfRequestedFood);
            const totalReceived = totalInOfRequestedFood[0]?.total || 0;

            const totalOutOfRequestedFood = await inventoryModel.aggregate([
                {$match:{
                    Organisation,
                    inventoryType:"Delivered",
                    foodType:requestedFoodType
                    },
                },
                {
                    $group:{
                        _id:'$foodType',
                        total:{$sum:'$quantity'}
                    },
                },
            ]);
            const totalSent = totalOutOfRequestedFood[0]?.total || 0;

            const availableQuantityOfFoodType = totalReceived-totalSent;
            if(availableQuantityOfFoodType<requestedQuantityofFood){
                return res.status(500).send({
                    success:false,
                    message:`Only ${availableQuantityOfFoodType} of ${requestedFoodType} is available`,
                });
            }
            req.body.CharitableTrusts = user?._id;
        }else{
            req.body.Donor = user?._id;
        }

        const  inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success:true,
            message:"New Food Donation Added",
        });

    }catch (error){
        console.log(error);
        return res.status(500).send({
        success:false,
        message:"User not Found",
        error,
        });
    }
};


const getInventoryController = async (req,res) => {
    try{
        const inventory = await inventoryModel.find({Organisation:req.body.userId})
        .populate("Donor").populate("CharitableTrusts").sort({createdAt: -1});
        return res.status(200).send({
            success:true,
            message:"Got all records Successfully",
            inventory,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Get Inventory',
            error,
        });
    }
};

const getInventoryTrustController = async (req,res) => {
    try{
        const inventory = await inventoryModel.find(req.body.filters)
        .populate("Donor").populate("CharitableTrusts").populate("Organisation").sort({createdAt: -1});
        return res.status(200).send({
            success:true,
            message:"Got all records Successfully",
            inventory,
        });
    }catch(error){  
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Trust's Inventory",
            error,
        });
    }
};

const getDonorController = async (req,res)=>{
    try{
        const Organisation = req.body.userId;
        const donorId = await inventoryModel.distinct("Donor",{
            Organisation,
        });
        // console.log(donorId); 
        const donors = await usermodel.find({_id:{$in: donorId}});
        return res.status(200).send({
            success:true,
            message:'Got the Donor Records Successfully',
            donors,
        });

    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Donor Records',
            error,
        });
    }
};

const  getTrustsController = async(req,res)=>{
    try{
        const Organisation = req.body.userId;
        const trustId = await inventoryModel.distinct('CharitableTrusts',{Organisation});
        const trustdata = await usermodel.find({role:"CharitableTrusts"},);
        const trusts = await usermodel.find({
            _id:{$in:trustId},
        });
        return res.status(200).send({
            success:true,
            message:"Data of Charitable Trusts are fetched Successfully",
            trusts,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in fetching Charitable Trusts",
            error,
        });
    }
};

const getOrganisationController = async(req,res) => {
    try{
        const Donor = req.body.userId;
        const orgId = await inventoryModel.distinct('Organisation',{Donor});
        const organisations = await usermodel.find({
            _id:{$in:orgId},
        });
        return res.status(200).send({
            success:true,
            message:"Organisation Data Got Successfully",
            organisations,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Organisation",
            error,
        });
    }
};

const getOrganisationforTrustController = async(req,res) => {
    try{
        const CharitableTrusts = req.body.userId;
        const orgId = await inventoryModel.distinct('Organisation',{CharitableTrusts});
        const organisations = await usermodel.find({
            _id:{$in:orgId},
        });
        return res.status(200).send({
            success:true,
            message:"Trust's Organisation Data Got Successfully",
            organisations,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Organisation",
            error,
        });
    }
};

const analyticsController = async (req,res) =>{
    try {
        const foodTypes = ["Rice Items (kg)", "Breakfast Items (kg)", "Snacks Items (kg)", "Juices and Beverages (l)"];
        const foodTypeData = [];
        const Organisation = new mongoose.Types.ObjectId(req.body.userId);
        await Promise.all(
          foodTypes.map(async (foodType) => {
            const totalIn = await inventoryModel.aggregate([
              {
                $match: {
                  foodType: foodType,
                  inventoryType: "Donated",
                  Organisation,
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$quantity" },
                },
              },
            ]);
            const totalOut = await inventoryModel.aggregate([
              {
                $match: {
                  foodType: foodType,
                  inventoryType: "Delivered",
                  Organisation,
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$quantity" },
                },
              },
            ]);

            const availableAmount = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);
            foodTypeData.push({
              foodType,
              totalIn: totalIn[0]?.total || 0,
              totalOut: totalOut[0]?.total || 0,
              availableAmount,
            });
          })
        );
    
        return res.status(200).send({
          success: true,
          message: "Food Type Data Fetch Successfully",
          foodTypeData,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          message: "Error In Food Type Data Analytics API",
          error,
        });
      }
};

const getRecentTransactionController = async(req,res) => {
    try{
        const inventory = await inventoryModel.find({
            Organisation:req.body.userId,
        }).limit(5).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            message:"Recent Data fetched successfully",
            inventory,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in getting the recent data",
            error,
        });
    }
};

const allOrganisations = async(req,res) => {
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

const allDonors = async(req,res) => {
    try{
        const donorData = await usermodel.find({role:"Donor"}).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            TotalCount : donorData.length,
            message:"Donors List got successfully",
            donorData,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in Donors List API",
            error,
        });
    }
};

const allTrust = async(req,res) => {
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

module.exports = { createInventoryController, getInventoryController, 
    getDonorController, getTrustsController, getOrganisationController,
    getOrganisationforTrustController,getInventoryTrustController, 
    analyticsController, getRecentTransactionController, allOrganisations, allDonors, allTrust};