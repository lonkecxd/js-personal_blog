const express = require('express');
const path = require('path');
//setting Express
const app = express();
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

app.listen(3000,()=>{console.log('app started')});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//bring in passport
const passport = require('passport');

//setting use
app.use(express.static(path.join(__dirname, 'static')));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());//打开post方法

// express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//express validator

app.use(expressValidator({errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
        ,root = namespace.shift()
        ,formParam = root;
    while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param: formParam,
        msg: msg,
        value: value
    };
}}));

//Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//setting Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/topology', {useMongoClient: true});
let db = mongoose.connection;
db.on('error', (err) => {
    console.log(error);
});
db.once('open',()=>{
    console.log('mongodb connected');
});

//bring in models
let topology = require('./mongodbModels/topology');
let line = require('./mongodbModels/line');


app.get('*',function (req,res,next) {
    res.locals.user = req.user || null;
    next();
});

app.get('/',(req,res)=>{
    topology.find({},(err,t)=>{
        line.find({},(err,l)=>{
            req.flash('success', 'Welcome');
            res.render('index',{
                title: 'Articles',
                articles: t,
                lines: l
            });
        })
    });

});



app.use('/user', require('./routes/user_route'));
app.use('/article', require('./routes/article_route'));