var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var emailCtrl = require('./email-controller');
var bcrypt = require('bcrypt-nodejs');

function createToken(user) {
    return jwt.sign({id: user.id, name: user.first_name}, config.jwtSecret);
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

exports.addUser = function(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({"msg": "You must set the email and password of the user!"});
    }

    var newUser = User(req.body);

    newUser.save((err, user) => {
        if (err) {
            return res.status(400).json(err);
        }
        emailCtrl.sendWelcomeEmail(user);
        res.status(201).json(user);
    });
};

exports.loginUser = function(req, res) {
    if (!req.body.email) {
        return res.status(400).send({"msg": "You must send the email!"});
    }

    if (!req.body.password) {
        return res.status(400).send({"msg": "You must send the password!"});
    }

    User.findOne({ email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(400).json(err);
        }

        if (!user) {
            return res.status(400).json({msg: "The user was not found"});
        }

        user.comparePassword(req.body.password, function(err, isMatch) {
            if (isMatch && !err) {
                res.status(200).json({token: createToken(user)});
            } else {
                res.status(400).json({msg: "The email or password is incorrect"});
            }
        });
    });
}

exports.getUser = function (req, res) {    
    User.findById(req.user.id, function(err, user) {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(user);
    });
}

exports.resetUserPw = function (req, res) {
    if (!req.body.email) {
        return res.status(400).send({"msg": "You must send the email!"});
    }

    let email = req.body.email;

    User.findOne({email: email}, function(err, user) {
        if (err) {
            return res.status(400).json(err);
        }

        if (!user) {
            return res.status(400).json({msg: "The user was not found"});
        }

        bcrypt.genSalt(10, function(err, salt) {
            if (err) return res.status(400).json(err);

            let randomPw = randomString(10);
    
            bcrypt.hash(randomPw, salt, null, function(err, hash) {
                if (err) return res.status(400).json(err);
    
                User.findByIdAndUpdate(user.id, {password: hash}, function(err, user) {
                    if (err) {
                        return res.status(400).json(err);
                    }

                    emailCtrl.sendResetPasswordEmail(user, randomPw);

                    return res.status(200).send({msg: "Check your Emails for a new password now!"});
                });
            });
        });

    });
}

exports.updateUser = function(req, res) {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            return res.status(400).json(err);
        }

        if (!user) {
            return res.status(400).json({msg: "The user was not found"});
        }

        if (req.body.old_password && req.body.new_password) {
            user.comparePassword(req.body.old_password, function(err, isMatch) {
                if (isMatch && !err) {
                    bcrypt.genSalt(10, function(err, salt) {
                        if (err) return res.status(400).json(err);

                        bcrypt.hash(req.body.new_password, salt, null, function(err, hash) {
                            if (err) return res.status(400).json(err);
                            
                            let updatedUser = req.body;
                            updatedUser.password = hash;
            
                            User.findByIdAndUpdate(user.id, updatedUser, {new: true}, function(err, user) {
                                if (err) {
                                    return res.status(400).json(err);
                                }
            
                                res.status(200).json(user);
                            });
                        });
                    });
                } else {
                    return res.status(400).json({msg: "Old Password wrong"});
                }
            });
        } else {
            User.findByIdAndUpdate(user.id, req.body, {new: true}, (err, user) => {
                if (err) {
                    return res.status(400).json(err);
                }
        
                res.status(200).json(user);
            });
        }
    });
}

exports.deleteUser = function(req, res) {
    User.findByIdAndRemove(req.user.id, (err, user) => {
        if (err) {
            return res.status(400).json(err);
        }

        res.status(200).json(user);
    });
}