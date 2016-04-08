var express = require('express');
var app = express();
var tweets = require('./routes/tweets');


app.use(express.static(__dirname +'./../app'));


// Environment::
try{
	var env = require('./config/env_dev');
}
catch(err){
	var env = require('./config/env_prod');
}



////// Routes:
app.use('/tweets', tweets);


// Listen on port..
app.listen(env.port,function(){
	console.log('Listenting on '+env.host+':'+env.port);
	console.log('Stop server with CTRL + C');
});