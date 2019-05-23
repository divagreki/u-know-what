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

var AppID = '微信公众号APPID（测试、正式号都可以）';
var AppSecret = 'appsecret';

app.get('/wechat_login', function(req,res, next){
	var router = 'get_wx_access_token';
	var return_uri = 'http%3A%2F%2Fwww.yhorizon.com%2F'+router;  
	var scope = 'snsapi_userinfo';
	res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');

});
app.get('/get_wx_access_token', function(req,res, next){

	var code = req.query.code;
	request.get(
			{   
				url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
			},
			function(error, response, body){
				if(response.statusCode == 200){

					var data = JSON.parse(body);
					var access_token = data.access_token;
					var openid = data.openid;
					request.get(
							{
								url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
							},
							function(error, response, body){
								if(response.statusCode == 200){

									var userinfo = JSON.parse(body);
									console.log('获取微信信息成功！');

									res.send("\
											<h1>"+userinfo.nickname+" 的个人信息</h1>\
											<p><img src='"+userinfo.headimgurl+"' /></p>\
											<p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
											<p>openid: "+userinfo.openid+"</p>\
											");
								}else{
									console.log(response.statusCode);
								}
							}
						   );
				}else{
					console.log(response.statusCode);
				}
			}
	);

	PORT = process.env.PORT || 5000
		app.listen(PORT);

	//localhost:5000
