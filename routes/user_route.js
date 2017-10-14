const express = require('express');
const router = express.Router();
let User = require('../mongodbModels/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/login',(req,res)=>{
    res.render('login',{
        title:'Login'
    })
});


router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/register',(req,res)=>{
    res.render('register',{
        title:'Register'
    })
});

router.post('/register',(req,res)=>{
    req.checkBody('username',"username is required").notEmpty();
    req.checkBody('password',"password is required").notEmpty();
    req.checkBody('password2',"Password doesn't match").equals(req.body.password);
    req.checkBody('email',"email is required").notEmpty();
    req.checkBody('email',"email is incorrect").isEmail();
    req.checkBody('name',"name is required").notEmpty();

    let params = req.body;
    let [username, password, password2,email, name] =
        [params.username, params.password, params.password2,params.email, params.name];

    let errors = req.validationErrors();
    if(errors) {
        res.render('register',{
            title: 'Register',
            errors:errors
        });
    }else {
        //do save stuff
        let newuser = new User({
            username: username,
            password: password,
            email: email,
            name: name
        });
        //加密密码
        bcrypt.genSalt(10,function (err, salt) {
            bcrypt.hash(newuser.password,salt,function (err, hash) {
                if(err)  throw err;
                newuser.password = hash;
                newuser.save((err2)=>{
                    if(err) throw err2;
                    req.flash('success', '注册成功！您的用户名是：'+newuser.name);
                    res.redirect('/user/login');
                })
            });
        })
    }
});


router.get('/logout',function (req, res) {
    req.logout();
    req.flash('success', '已退出登录');
    res.redirect('/user/login');
});

module.exports = router;