//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const md5 = require("md5")
// const bcrypt = require("bcrypt")
// const saltRounds = 10;
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const _ = require("lodash")
// console.log(md5("123456"));

const app = express();

mongoose.set('strictQuery', false)



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);

const postSchema = {
    title:String,
    content:String
  }
  
  const Post = new mongoose.model("Post",postSchema)
  
  const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile.displayName);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res){
  res.render("default");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    //Sucessfully authentication, redirect to secrets
    res.redirect('/home');
  });

app.get("/login", function (req, res) {
    res.render("login")
})
app.get("/register", function (req, res) {
    res.render("register")
})

app.get("/home", function (req, res) {


    if (req.isAuthenticated()) {
        Post.find({},function(err,posts){
            if(err){
              console.log(err);
            }
            else{
              res.render("home",{
                startingContent:homeStartingContent,
                posts:posts
              })
            }
          })
            // res.render(__dirname + "/views/home.ejs")
          
    }
    else {
        res.render("login")
    }
})

app.get("/posts/:postId",function(req,res){
  if (req.isAuthenticated()) {
    Post.findOne({_id: requestedPostId}, function(err, post){

  
        res.render("post", {
          title: post.title,
     
          content: post.content
     
        });
    });
}
else {
    res.render("login")
}
})

app.post("/compose",function(req,res){
    // console.log(req.body.postTitle);
    // console.log(req.body.postBody);
  const post = new Post ({
    title : req.body.postTitle,
    content :req.body.postBody
    
  })
  
  post.save(function(err){
    if(!err){
      res.render("/home")
    }
  });
  // console.log(post);
  // posts.push(post)
  res.redirect("/home")
  // console.log(post.title);
  })

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        else {

            res.redirect("/")
        }
    });
})

app.post("/register", function (req, res) {

    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            res.redirect("/register")
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets")
            })
        }
    })


})

app.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets")
            })
        }
    })

})



app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
  
    Post.findByIdAndDelete(checkedItemId,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Sucessfully deleted checked item");
        res.redirect("/home");
      }
    })
  })
  
  
  
  


app.listen(3000, function () {
    console.log("Server started at port 3000");
})