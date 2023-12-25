const express = require('express');
const app = express()
const path = require('path')
const passport = require('passport');
const session = require('express-session')
 const google= require('./auth')
app.use(express.json());
app.use(express.static(path.join(__dirname,'client')))

function isLggedin(req,res,next) {
    req.user.email==='subhintm2018@gmail.com' ? next() :res.send("should signup first")
    
}
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  app.use(passport.initialize()); 
  app.use(passport.session());

app.get('/',(req,res) => {
    res.sendFile('index.html')
})



app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));



app.get('/auth/google/success',isLggedin,(req,res) => {
    console.log(req.user);
    let name = req.user.displayName;
    res.send(`hello ${name}  <button><a href='/auth/logout'>Log Out</a></button>`)
})

app.get('/auth/google/failure',isLggedin,(req,res) => {
    res.send('error')
})

app.get('/auth/logout',(req,res) =>{
    req.session.destroy();
    res.redirect('/')
});

app.listen(5000,() => {
    console.log('server is running');
})