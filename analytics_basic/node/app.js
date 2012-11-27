var express = require('express')
	, app = express()
	, site = require('./site');

request = require('request');
username = "testuser",
key = "567df000b3e5c0a203f42666531e16ed",
url = "https://" + username + ":" + key + "@store-bwvr466.mybigcommerce.com/api/v2/";

request = require('request');
//https://testuser:567df000b3e5c0a203f42666531e16ed@store-bwvr466.mybigcommerce.com/api/v2/

// Config

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({ secret: "bcsession foo bar" }));

// General

app.get('/', site.index);
app.post('/load', function(req,res){
  req.session.username = (req.body.name.length < 1)?username:req.body.name;
  req.session.key = (req.body.name.length < 1)?key:req.body.key;
  req.session.url = (req.body.name.length < 1)?url:req.body.url;
  console.log(req.session);
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end();
  
});
server = require('http').createServer(app);
io = require('socket.io').listen(server);

app.get('/dashboard', site.dashboard);


server.listen(3000);
console.log('Express app started on port 3000');