const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://u-know-what.herokuapp.com/auth/github/callback"
  },
   function(accessToken, refreshToken, profile, cb) {
       console.log(profile);
       console.log(accessToken);
       //return cb(null, profile);
   }
//     function(accessToken, refreshToken, profile, cb) {
//    	 User.findOrCreate({ githubId: profile.id }, function (err, user) {
//     	 return cb(err, user);
//				});
 // }
));

const app = express();

app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function(req, res){
  }
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/');
 });


app.get('/error', (req, res) => {
	res.render("error");
});

app.get('/success', (req, res) => {
	res.render("success");
});

app.get('/', (req, res) => {
	console.log("home get.");
	res.send("Hello! get!");
});
app.post('/', (req, res) => {
	console.log("home post.");
	res.send("Hello post!");
})
app.get('/del', (req, res) => {
	console.log("get:del.");
	res.send("del!");
});
app.get('/insert', (req, res) => {
	console.log("get:insert");
	res.send("insert!");
});
app.get('/search', (req, res) => {
	console.log("get:search");
	res.send("search!");
});

//==========================WECHAT================================

/**
var OAuth = require('wechat-oauth');
var oauthApi = new OAuth('xxx','xx');
var red_url = 'https://u-know-what.herokuapp.com/callback';

app.get('/wechat', function(req, res) {
	var url = oauthApi.getAuthorizeURL(red_url,'','snsapi_base');
	console.log(url);   
	res.redirect(url); 
});



app.get('/callback', function (req, res) {  
	console.log('----weixin callback -----');
	var code = req.query.code;
	console.log("code =" + code);
	res.send('code = '+ code);
	
	oauthApi.getAccessToken(code, function (err, result){
		var accessToken = result.data.access_token;
		var openid = result.data.openid; 
		console.log('openid='+ openid);
		oauthApi.getUser(openid, function (err, result1) {
			console.log('use weixin api get user: ' + err);
			console.log(result);
			var oauth_user = result1;
			console.log("userinfo" + JSON.stringify(oauth_user, null, '      '));

			res.redirect('/');
		});
		console.log("blf write" + JSON.stringify(result.data, null, '   '));
	});
	
});


app.get('/gettoken', (req, res) => {
	console.log("home post.");
	res.send("Hello post!");
});
**/

// ==========================GITHUB================================
var githubConfig = {
    client_ID: 'db99d9c8c96b7ad24be8',
    client_Secret: '13524b5210100cdfa5da73d8bd26a0f5ce6c2151',
    access_token_url: 'https://github.com/login/oauth/access_token',
    scope: 'user'
}


app.get('/github', function(req, res) {
    //  重定向到认证接口,并配置参数
    let path = "https://github.com/login/oauth/authorize"
    path += '?client_id=' + githubConfig.client_ID
    path += '&scope=' + githubConfig.scope 
    // 转发到授权服务器
    res.redirect(path)
});


app.get('/github_callback', function(req, res) {
    var code = req.query.code;
    var myJSONObject = {
	'client_id' : githubConfig.client_ID, 
	'client_secret' : githubConfig.client_Secret,
	'code' : code
    };

// 	request({
// 	    url: "https://github.com/login/oauth/access_token",
// 	    method: "POST",
// 	    json: true,   // <--Very important!!!
// 	    body: myJSONObject
// 	}, function (error, response, body){
// 	    console.log(response);
// 	});
var request = require('request');
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
});


PORT = process.env.PORT || 5000
app.listen(PORT);

//localhost:5000
