const express = require('express');
const router = express.Router();

router.get('/',ensureAuthenticated,(req,res)=>{
    let user = req.user;
    console.log("User", user);
    res.render('article',{
        author: user.name
    });
});

router.get('/add',ensureAuthenticated,(req,res)=>{

});

router.get('/delete',ensureAuthenticated,(req,res)=>{
    //method 是 Delete
    if(!req.user._id) {
        res.status(500).send();
    }
    res.send('Success');
});

//放到最后，避免混淆
router.get('/:id',(req,res)=>{

});

//Access control
function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }else {
        req.flash('danger', 'Please Login');
        res.redirect('/user/login');
    }
}

module.exports = router;