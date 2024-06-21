const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    inventoryType:{
        type:String,
        required : [true,'Inventory type required'],
        enum : ["Donated", "Delivered"]
    },
    foodType : {
        type:String,
        required : [true,"Type of Food is required"],
        enum : ["Rice Items (kg)", "Breakfast Items (kg)", "Snacks Items (kg)", "Juices and Beverages (l)"],
    },
    quantity:{
        type:Number,
        require:[true, "The Quantity of the food is required"],
    },
    email:{
        type:String,
        required:[true,"Donor Email is Required"],
    },
    Organisation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:[true,"Organisation is Required"],
    },
    CharitableTrusts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: function(){
            return this.inventoryType === "Delivered";
        },
    },
    Donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required : function(){
            return this.inventoryType==="Donated";
        },
    },
},
{timestamps:true});

module.exports = mongoose.model("Inventory", inventorySchema);