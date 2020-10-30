const express = require('express');
const app = express();
var formidable = require('formidable');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var cors = require('cors');
const fs = require('fs');
const Path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
var fileExtension = require('file-extension');
var dir = require('node-dir');
const chalk = require('chalk');
var randomize = require('randomatic');
var cookieParser = require('cookie-parser');

var port_number = process.env.PORT || 3000;
//FILE TYPE
const FileType = require('file-type');
var detect = require('detect-file-type'); //FILE TYPE
require('dotenv').config();
const PIG = require("./models/createpig"); //WTF_Project/models/createpig.js



const path = require('path');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(cookieParser());


mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log(chalk.green.bold("DONE"));
});

app.get("/",(req,res)=>{
//create 
	//1. Name
	//2.
	console.log(req.cookies.pigId);
	if(req.cookies.pigId !=undefined){
		res.redirect("/pig");
	}
	else if(req.cookies.pigId ===undefined){
		res.cookie("pigId",uuidv4());
	//if Pig already exist we will redirect to other page
	
	res.render("create");
}
	
})
app.post("/create/pig",(req,res)=>{
	
	console.log("pigId : ",req.cookies.pigId);
		console.log("pig Body : ",req.body);
		const pig = new PIG();
		pig.name=req.body.name;
		pig.pigId=req.cookies.pigId;
		pig.save((err,pigdone)=>{
			if(err){
				console.log(err);
			}
			else if(pigdone){
				console.log(pigdone);
				res.redirect("/pig");
			}
})
});
app.get("/pig",(req,res)=>{
		const pigId=req.cookies.pigId;
		console.log("pigId : ",req.cookies.pigId);
		PIG.findOne({pigId:pigId},(err,pigpig)=>{
			if(err){
								console.log(err);

}		
			if(pigpig === null){
						res.clearCookie("pigId");
				res.redirect("/");
			}
			else if(pigpig){
								console.log(pigpig);
				if(pigpig.chat && pigpig.chat.length>0){
											res.render("pig",{pig:pigpig.name,pigId:pigpig.pigId,msg:pigpig.chat});

				}
				else{
											res.render("pig",{pig:pigpig.name,pigId:pigpig.pigId,msg:null});

}

}
})
})


app.get("/pig/send/:pigId/:pig",(req,res)=>{
				console.log("pigId : ",req.params.pigId);
				res.render("message",{pigId:req.params.pigId,pig:req.params.pig});
				
})

app.post("/pig/receive/:pigId/:pig",(req,res)=>{
			const pigId=req.cookies.pigId;
					console.log("pigId : ",req.body.msg);

					console.log("pigId : ",req.params.pigId);
	PIG.findOne({pigId:req.params.pigId},(err,pigpig)=>{
			if(err){
								console.log(err);

}
			
								console.log(pigpig);
								pigpig.chat.push(req.body.msg);
								pigpig.save((E,D)=>{
									if(E){
										console.log(E);
									}
									else if(D){
										console.log(D);
										const LINK = "https://wtf-project-pbzob.run-ap-south1.goorm.io/"+req.cookies.pigId
										console.log(LINK);
										res.render("sent",{pig:D.name,LINK:req.params.pigId});
									}
});
						

})
					
});

app.get("/pig/delete/:pigId",(req,res)=>{
									console.log(req.cookies.pigId);
			res.clearCookie("pigId");
													res.redirect("/")


		
});
app.listen(port_number,()=>{
		console.log("Server Connected !!!!");
})