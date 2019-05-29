const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var request = require('request');
var needle = require('needle');



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
			callbackURL: '/auth/google/callback',
			proxy: true
		}, 
		(accessToken, refreshToken, profile, done) =>	{
			console.log(profile);
		}
	)
);

const app = express();
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

app.get('/auth/google/failure', (req, res) => {
	res.render("error");
});

app.get('/auth/google/success', (req, res) => {
	res.render("success");
});

app.get('/', (req, res) => {
	console.log("home get.");
	res.send("Hello! get!");
});

PORT = process.env.PORT || 5000
app.listen(PORT);

//localhost:5000
