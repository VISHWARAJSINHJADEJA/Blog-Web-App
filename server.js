const express = require("express")

const app = express();

app.get("/news/:topic",function(req,res){
console.log(req.params.topic); //it can log params to the : in front of any route you use
})


app.listen(3000,function(){
    console.log("Server started running on port 3000");
})