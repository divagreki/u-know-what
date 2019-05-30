const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

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

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/', (req, res) => {
	console.log("home get.");
	res.send("Hello! get!");
});
/*
//====================================================== GITHUB ====================================================================
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://u-know-what.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ githubId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
	console.log("success.");
  }
))

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/error', (req, res) => {
	console.log("error.");
	res.send("Error!");
});
*/
PORT = process.env.PORT || 5000
app.listen(PORT);

//localhost:5000
