var express = require('express');
const passport = require('passport');
var router = express.Router();
const localStrategy=require("passport-local")
var userModel = require('./users');
passport.use(new localStrategy(userModel.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
    }
    res.redirect("/");
}

router.post('/register',function(req,res){
  var userdata = new userModel({
    username:req.body.username,
    secret:req.body.secret
  })
  // console.log(req.body);
  userModel.register(userdata ,req.body.password)
.then(function(registereduser){
  passport.authenticate("local")(req,res,function(){
    res.redirect('/profile')
  })
})
})



router.post("/login" ,passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){})

router.get('/logout',function(req,res,next){
req.logout(function(err){
  if(err){return next(err);}
  res.redirect('/')
})
})

module.exports = router;
