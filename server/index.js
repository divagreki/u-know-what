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

//==========================WECHAT================================


var OAuth = require('wechat-oauth');
var oauthApi = new OAuth('wxed3140d08c8341d5','1a4a7ed9206f4f26a6f7597c357c9651');
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
	/**
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
	**/
});


app.get('/gettoken', (req, res) => {
	console.log("home post.");
	res.send("Hello post!");
});

// ==========================GITHUB================================
var githubConfig = {
    client_ID: 'db99d9c8c96b7ad24be8',
    client_Secret: '13524b5210100cdfa5da73d8bd26a0f5ce6c2151',
    access_token_url: 'https://github.com/login/oauth/access_token',
    user_info_url: 'https://api.github.com/user?',
    redirect_uri: 'http://manage.hgdqdev.cn/#/login',
    scope: 'user'
}


app.get('/github', function(req, res) {
    const dataStr = (new Date()).valueOf()
    //  重定向到认证接口,并配置参数
    let path = "https://github.com/login/oauth/authorize"
    path += '?client_id=' + githubConfig.client_ID
    path += '&scope=' + githubConfig.scope
    path += '&state=' + dataStr
    // 转发到授权服务器
    res.redirect(path)
});
/**
app.get('/github_callback', function(req, res) {
    const code = req.query.code;
    let path = 'https://github.com/login/oauth/access_token';
    res.send('github code =' + code);
    
    const params = {
        client_id: githubConfig.client_id,
        client_secret: githubConfig.client_Secret,
        code: code
    }
    fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(result => {
        return result.text()
    }).then(body => {
        let access_token = body.split('&')[0].split('=')[1]
        return access_token
    }).then(token => {
        const url = ' https://api.github.com/user?access_token=' + token;
        fetch(url)
            .then(info => {
                return info.json();
            })
            .then(github_info => {
                UserModel.getUserByOauthInfo({ type: 'github', name: github_info.login }).then(user => {
                    if (user) {
                        // 已注册，获取登录信息后直接跳转到列表页
                        user = user.toObject()
                        delete user.password
                        req.session.user = JSON.parse(JSON.stringify(user))
                        res.redirect(`${config.main_url}?username=${user.username}`)
                    } else {
                        // 如果没有注册，就跳转到注册界面
                        res.redirect(`${config.register_url}?name=${github_info.login}&type=github&avatar_url=${github_info.avatar_url}&bio=${github_info.bio}`)
                    }
                })
                
            })

    })
    
});

**/


app.get("/github_callback", function(req, res){
    var code = req.query.code;
    var state = req.query.state;
    var headers = req.headers;
    var path = "/login/OAuth/access_token";
    headers.host = 'github.com';


    path += '?client_id=' + githubConfig.client_ID;
    path += '&client_secret='+ githubConfig.client_Secret;
    path += '&code='+ code;
    console.log(path);
    var opts = {
        hostname:'github.com',
        port:'443',
        path:path,
        headers:headers,
        method:'POST'
    };

    var req = https.request(opts, function(res){
        res.setEncoding('utf8');
         console.log(opts);
    
        res.on('data', function(data){
            var args = data.split('&');
            var tokenInfo = args[0].split("=");
            var token = tokenInfo[1];
            console.log(data);
          
            var url = "https://api.github.com/user?access_token="+token+"&scope=user";
            https.get(url, function(res){
                res.on('data', function(userInfo){
                   console.log(userInfo);
                   res.send('userInfo: '+ userInfo)
                });
            });
          
        })
    });
});


PORT = process.env.PORT || 5000
app.listen(PORT);

//localhost:5000
