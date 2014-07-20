var express = require('express'),
    app = express();
var dbobj = require('./dbhandle.js');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var session = require('express-session');
var cookieparser = require('cookie-parser');
var fs = require("fs");

app.use(bodyParser());       // to support JSON-encoded bodies

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,"/public/images")}));

});

app.use(session({secret: 'keyboard cat'}))
//console.log(path.join(__dirname + "/", "public"));
app.use(express.static(__dirname + "/public"));

app.use(cookieparser());

//User RESTful Web Services
//app.get('/user', dbobj.getUserList);
app.get('/user/:id', dbobj.getUserImage);

app.get('/logout', dbobj.logoutUser);

app.post('/login', dbobj.checkUser);

app.get("/login", function (req, res) {
    var data = fs.readFileSync("pages/index.html");
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(data);
    res.end();
    //res.send(data);
})

app.get('/profile', function (req, res) {
    if (!req.session.user) {
        var data = fs.readFileSync("pages/index.html");
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();

    }
    else {
        var data = fs.readFileSync("pages/main.html");
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();

    }
});

app.post('/upload',function(req,res){
    var tmp_path = req.files.thumbnail.path;
    console.log(tmp_path);
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/images/' + req.session.user+'.jpg';
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.redirect('/profile');
        });
    });
});

app.post('/register', dbobj.registerUser);

app.get('/updateStatus/:id',dbobj.updateStatus);
http.createServer(app).listen(7777);

