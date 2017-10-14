const LocalStrategy = require('passport-local').Strategy;
const User = require('../mongodbModels/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs'); 

module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({username:username},(err,user)=>{
            if(err) throw err;
            if(!user) {
                return done(null,false,{message:"User doesn't exist"})
            }
            bcrypt.compare(password,user.password,function (err,match) {
                if(err) throw err;
                if(match) {
                    return done(null,user);
                }else {
                    return done(null,false,{message:"Wrong password"})
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
