const express = require("express");
const bodyParser = require("body-parser");
const https=require("https");
// const request=require("request");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});


app.post("/",function(req,res){
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:lastname
                }
            }
        ]
    };
    const jsondata=JSON.stringify(data);
    const url="https://us17.api.mailchimp.com/3.0/lists/76574ab263";
    const options={
        method:"POST",
        auth:"shantanu:19daa6e9fc7e797808030eae32b91eb1-us17"
    }
    const request=https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });    
    request.write(jsondata);
    request.end();
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server started on port 3000");
});