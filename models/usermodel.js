const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    role : {
        type : String,
        required : [true, 'Role is required'],
        enum: ['Admin','Organisation','Donor','CharitableTrusts']
    },
    name : {
        type : String,
        required : function() {
            if(this.role==='Donor' || this.role==='Admin'){
                return true;
            }
            return false;
        }
    },
    organisationName : {
        type : String,
        required : function() {
            if(this.role==='Organisation'){
                return true;
            }
            return false;
        }
    },
    trustsName : {
        type:String,
        required : function() {
            if(this.role==='CharitableTrusts'){
                return true;
            }
            return false;
        }
    },
    email : {
        type : String,
        require:[true,'email is required'],
        unique:true,
    },
    password : {
        type : String,
        required : [true, 'password is required'],
    },
    address : {
        type : String,
        required : [true, 'Address is required'],
    },
    phone : {
        type : String,
        required : [true , " phone number is required"],
    },
}, { timestamps : true});

module.exports = mongoose.model('users',userSchema);