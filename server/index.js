const express = require('express');
const app = express();

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

var OAuth = require('wechat-oauth');
var oauthApi = new OAuth('wxed3140d08c8341d5','1a4a7ed9206f4f26a6f7597c357c9651');
app.get('/callback', function (req, res) {  
	console.log('----weixin callback -----');
	var code = req.query.code;
	console.log("code =" + code);
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

var callbackURL = 'https://u-know-what.herokuapp.com/callback';

app.get('/oauth2', function(req, res) {
	var url = oauthApi.getAuthorizeURL(callbackURL,'','snsapi_base');
	console.log(url);   
//	res.redirect(url); 
});


app.post('/gettoken', (req, res) => {
	console.log("home post.");
	res.send("Hello post!");
})



PORT = process.env.PORT || 5000
app.listen(PORT);

//localhost:5000
