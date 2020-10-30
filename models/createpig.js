const mongoose  = require("mongoose");



const pigSchema = new mongoose.Schema({


	name:{
		type:String,
		required:true
	},
	pigId:{
		type:String,
		required:true
	},
	chat:[{
    type: String
}]
},{ timestamps: true })


module.exports = mongoose.model("pig",pigSchema)

