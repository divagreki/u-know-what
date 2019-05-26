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
var red_url = 'https://u-know-what.herokuapp.com/gettoken';

app.get('/wechat', function(req, res) {
	var url = oauthApi.getAuthorizeURL(red_url,'','snsapi_base');
	console.log(url);   
	res.redirect(url); 
});



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


app.post('/gettoken', (req, res) => {
	console.log("home post.");
	res.send("Hello post!");
})

// ==========================GITHUB================================
/**
app.get('/login', checkNotLogin, async (req, res, next) => {
    const dataStr = (new Date()).valueOf()
    //  重定向到认证接口,并配置参数
    let path = "https://github.com/login/oauth/authorize"
    path += '?client_id=' + config.client_id
    path += '&scope=' + config.scope
    path += '&state=' + dataStr
    // 转发到授权服务器
    res.redirect(path)
})

app.get('/oauth/callback', checkNotLogin, (req, res, next) => {
    const code = req.query.code;
    let path = 'https://github.com/login/oauth/access_token';
    const params = {
        client_id: config.client_id,
        client_secret: config.client_secret,
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
})

**/

PORT = process.env.PORT || 5000
app.listen(PORT);

//localhost:5000
