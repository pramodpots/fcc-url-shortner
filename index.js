'use strict';
var mongo = require("mongodb").MongoClient;
var express = require("express");
var path = require("path");
var app = express();
var url = "mongodb://localhost:27017/data";
var sitesCollection;

// this regex expression is originally built by Rafase282
var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

mongo.connect(url,function(err,db){
    if(err) throw err
    else console.log("db conncted on: " + url);

    db.createCollection("sites",{
        caped: true,
        size: 8489330,
        max: 3000
    });
        sitesCollection = db.collection('sites');
        
        //This will direct to main page
app.get('/', function(req, res) {
    var filename = path.join(__dirname, 'index.html');
    res.sendFile(filename, function(err) {
        if (err) console.log(err)
        else
            console.log("sent" + filename);
    })
     });

    
        //This will redirect to orginal url when shortened url is passed
    app.get('/:short',function(req, res) {
        var short = req.params.short;
        
        sitesCollection.findOne({"shortened" : short  },{"original" : 1, _id : 0}, function(err,result){
        if(err) throw err;
        else if(result){
            var org = result.original;
            res.redirect(org);
        }else{
            res.json({"error" : "This url is not in database"} );
        }
    })
    })   
    
    
     //This will run when new url is passed
    app.get('/new/*',function(req,res){
        var url = req.params[0];
        var urlOBJ = {};
        console.log("url: " + url + "\n" + regex.test(url))
        if(regex.test(url)){
            
            var short = Math.floor(100000 + Math.random() * 800000).toString();
            //short = path.join(process.env.App_URL,short);
            urlOBJ = {
                "original" : url,
                "shortened" : "https://"+process.env.C9_HOSTNAME +"/"+ short
            };
            res.json(urlOBJ);
            
            
            sitesCollection.save({
                "original" : url,
                "shortened" : short
            })
           
        }else{
            res.json({
                error : "This url: " + url + "is not an valid url"
            });
        }
    })
    
    
    app.listen(8080,function(){
    console.log("url-shortner app is running..");
    }); 
    
})// end of mongo connection

    

   

     
    
    
   
    

