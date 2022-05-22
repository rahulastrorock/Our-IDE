const mongoose = require("mongoose") ; 

const codeSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
    },
    input:{
        type:String,
    },
    language:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        default:Date.now(),
        required:true
    },
    expiryDate:{
        type:String,
        default:Date.now(),
        required:true
    }
})

const Code = mongoose.model("code",codeSchema) ; 

module.exports = Code ;