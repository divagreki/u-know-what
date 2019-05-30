var express = require('express');
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});
/*
   passport.use(
   new GoogleStrategy(
   {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: 'https://u-know-what.herokuapp.com/auth/google/callback'
   }, 
   (accessToken, refreshToken, profile, done) =>	{
   console.log(profile);
   }
   )
   );
   */
passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: "http://localhost:5000/auth/github/callback"
	//callbackURL: "https://u-know-what.herokuapp.com/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
	console.log("token = "+ accessToken);
}
));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


//====================================================== GOOGLE  ====================================================================
/**
  app.get(
  '/auth/google', 
  passport.authenticate('google', {
  scope: ['profile','email']
  })
  );

  app.get(
  '/auth/google/callback', 
  passport.authenticate('google'),
  (req, res) => {
  res.redirect('/auth/google/success');
  }
  );
 **/
//====================================================== GITHUB ====================================================================

app.get('/auth/github',
		passport.authenticate('github', { scope: [ 'user:email' ] }),
		function(req, res){
		// The request will be redirected to GitHub for authentication, so this
		// function will not be called.
		});
app.get('/auth/github/callback', 
		passport.authenticate('github', { failureRedirect: '/login' }),
		function(req, res) {
		res.redirect('/nice');
		});

app.get('/error', (req, res) => {
	console.log("error.");
	res.send("Error!");
});

app.get('/', (req, res) => {
	console.log("home get.");
	res.send("Hello! get!");
});
app.get('/nice', (req, res) => {
	console.log("NICE.");
	res.send("NICE!");
});

PORT = process.env.PORT || 5000
app.listen(PORT);

//localhost:5000
