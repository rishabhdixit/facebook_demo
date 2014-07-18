var express = require('express'),
    app = express();
var dbobj = require('./dbhandle.js');
var bodyParser = require('body-parser');
//var path = require('path');
var http = require('http');
var session = require('express-session');
var cookieparser = require('cookie-parser');
var fs = require("fs")

app.use(bodyParser());       // to support JSON-encoded bodies

app.use(session({secret: 'keyboard cat'}))
//console.log(path.join(__dirname + "/", "public"));
app.use(express.static(__dirname + "/public"));

app.use(cookieparser());

//User RESTful Web Services
//app.get('/user', dbobj.getUserList);
app.get('/user/:id', dbobj.getUser);

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

app.post('/register', dbobj.registerUser);

http.createServer(app).listen(7777);

