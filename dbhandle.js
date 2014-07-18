var mongoose = require('mongoose');
var async = require('async');
var URIString = "mongodb://localhost/facebookdb";
var db = mongoose.createConnection(URIString);


var userSchema = new mongoose.Schema({
    FirstName: {type: String},
    LastName: {type: String},
    Email: {type: String},
    Password: {type: String},
    Img: {type: String}
});

var adminSchema = new mongoose.Schema({
    FirstName: {type: String},
    LastName: {type: String},
    Email: {type: String},
    Password: {type: String},
    Img: {type: String}
});


var userModel = db.model('User', userSchema);
var adminModel = db.model('Admin', adminSchema);


var user = new userModel({
    FirstName: 'rishabh',
    LastName: 'dixit',
    Email: 'rishabh@gmail.com',
    Password: 'abcde',
    Img: 'http://localhost:7777/images/Lionel-Messi-Lattest-HD-Wallpaper-2014.jpg'
});


var user1 = new userModel({
    FirstName: 'shivam',
    LastName: 'dixit',
    Email: 'shivam@gmail.com',
    Password: 'abcde',
    Img: 'http://localhost:7777/images/leaveimg.jpg'
});


/*user.save(function (err) {
 if (err) {
 console.log("Error occurred while saving the user record: " + err);
 }
 else{
 console.log("User Record Saved Successfully ");
 }
 });



 user1.save(function (err) {
 if (err) {
 console.log("Error occurred while saving the user record: " + err);
 }
 else{
 console.log("User Record Saved Successfully ");
 }
 });*/





//user Methods
exports.getUserList = function (req, res) {
    userModel.find({}).exec(function (err, data) {
        if (err) {
            res.send("Error occurred while fetching the user record: " + err);
        }
        else {
            res.send(data);
        }
    });
}

exports.getUser = function (req, res) {
    userModel.findOne({Email: req.params.id}).exec(function (err, data) {
        if (err) {
            res.send("Error occurred while fetching the user record: " + err);
        }
        else {
            res.send(data);
        }
    });
}

exports.checkUser = function (req, res) {

    userModel.findOne({Email: req.body.Email}).exec(function (err, data) {
        if (err) {
            console.log("Error occurred while fetching the user record :" + err)
            res.send("Error occurred while fetching the user record")
        }
        else {
            if (req.body.Password === data.Password) {
                //res.writeHead(200, { 'Set-Cookie': 'myCookie='+data.Email, 'Content-Type': 'text/plain' });
                if (!req.session.user) {
                    //req.session.regenerate(function () {
                        req.session.user = "admin";
                    //});
                }
                res.cookie('user_id', data.Email);
                res.redirect('/profile');

            }
            else
                res.redirect('/login');

        }
    });
}


exports.logoutUser = function (req, res) {
    // req.session.user = req.session.user + req.session.user
    req.session.user = null;
    res.redirect('/login');


}


exports.registerUser = function (req, res) {
    var user = new userModel({
        FirstName: req.body.firstname,
        LastName: req.body.lastname,
        Email: req.body.reg_email__,
        Password: req.body.reg_passwd__,
        Img: 'http://localhost:7777/images/default.jpg'
    });

    user.save(function (err) {
        if (err) {
            res.redirect('../pages/index.html');
        }
        else {

            res.redirect('../pages/index.html');
        }
    });


}


exports.postUser = function (req, res) {

    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var email = req.body.Email;
    var pass = req.body.Password;
    var user = new userModel({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: pass
    });

    user.save(function (err) {
        if (err) {
            res.send("Error occurred while saving the user record: " + err);
        }
        else {
            res.send("User Record Saved Successfully ");
        }
    });

    userModel.find({}).exec(function (err, data) {
        if (err)
            console.log("Error occurred while adding the user record :" + err);
        else
            callback("User Record successfully added using post request");
    });


}


exports.deleteUser = function (req, res) {
    userModel.remove({email: req.params.id}).exec(function (err) {
        if (err)
            res.send("Error while deleting user using delete request:" + err);
        else
            res.send("User Record deleted successfully using delete request ");
    });
}

exports.putUser = function (req, res) {
    userModel.update({email: req.params.id}, {$set: req.body}).exec(function (err, result) {
        if (err) {
            console.log("Error occurred while updating the user record: " + err);
        } else {
            callback("User Record updated: " + result);
        }
    });
}



