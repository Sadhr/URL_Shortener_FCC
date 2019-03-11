'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

const dns = require('dns');

var bodyParser = require('body-parser');

var app = express();

const urlValidator = require("./utils/validator");
const urlSave = require("./model/db");

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.post("/api/shorturl/new", (req, res) => {
  
  const urlValid = urlValidator.validateUrl(req.body.url);
  
  if(!urlValid){
    console.log("Invalid URL")
    res.json({error: "invalid URL"})
  }else{
    urlValidator.validateHost(req.body.url, (err, url) => {
        if(err){
          return res.json({error: "invalid Hostname"})
        }else{
          urlSave.createAndSaveUrl(url, (err, shortUrl) => {
            if(err) return res.json({error: "DB Error"});
            res.json({original_url: req.body.url, short_url: shortUrl});
        });
      }
    });
  } 
})

app.get("/api/shorturl/:shorturl", (req, res) => {
  urlSave.findUrlByShortName(req.params.shorturl, (err, data) => {
    if(err) return res.send("ERROR");
    res.redirect(data);
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});