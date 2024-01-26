import mongoose from "mongoose";
const connection= mongoose.connect("mongodb://localhost:27017/Login");
connection.then(()=>{
    console.log("success Ra");
})
.catch(()=>{
         console.log("Neyellam uru pada maatey");
 })

 const Loginschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }

 })
 

 const collection = mongoose.model('user', Loginschema);

export  default collection;



