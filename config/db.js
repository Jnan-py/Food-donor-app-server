const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Mongodb ${mongoose.connection.host} `.bgCyan.white);
    } catch (error){
        console.log(`Mongo DB error ${error}`.bgRed.white);
    }
};

module.exports = connectDB;