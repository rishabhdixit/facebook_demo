var fs = require('fs');
var mongoose = require('mongoose');
var async = require('async');
var URIString = "mongodb://localhost/facebookdb";
var db = mongoose.createConnection(URIString);


var userSchema = new mongoose.Schema({
    FirstName: {type: String},
    LastName: {type: String},
    Email: {type: String},
    Password: {type: String},
    Status: {type: String}
});


var userModel = db.model('User', userSchema);

var user = new userModel({
    FirstName: 'rishabh',
    LastName: 'dixit',
    Email: 'rishabh@gmail.com',
    Password: 'abcde',
    Status:'this is default status'
});


var user1 = new userModel({
    FirstName: 'shivam',
    LastName: 'dixit',
    Email: 'shivam@gmail.com',
    Password: 'abcde',
    Status:'this is default status'
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

exports.getUserImage = function (req, res) {
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

                if (!req.session.user) {

                        req.session.user = data._id;

                }
                var path = "./public/images/"+req.session.user+".jpg";
                if(fs.existsSync(path)){
                        res.cookie('user_id',data.Email);
                        res.redirect('/profile');
                }
                else {

                    var tmp_path = "./public/images/default.jpg";

                    var target_path = './public/images/' + req.session.user + '.jpg';

                    fs.readFile(tmp_path, function (err, data) {

                        fs.writeFile(target_path, data, function (err) {
                            if(err){

                                res.send(err);
                            }

                        });
                    });
                    res.cookie('user_id', data.Email);
                    res.redirect('/profile');
                }
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
        Status:'this is default status'
    });


    user.save(function (err) {
        if (err) {
            res.redirect('/login');
        }
        else {

            res.redirect('/login');
        }
    });


}

exports.updateStatus = function (req,res) {
    userModel.update({_id:req.session.user},{Status:req.params.id}).exec(function(err,result){
        if(err){
            res.send("Error occurred while updating the record: "+err);
        }else{
            res.send("Record updated: "+result);
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



