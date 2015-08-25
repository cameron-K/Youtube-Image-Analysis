var express=require('express');
var app=express();
var bodyParser=require('body-parser');


app.use(bodyParser.json());
require('./config/routes.js')(app);
app.use(express.static(__dirname + '/public'));


app.listen(process.env.PORT || 8000,function(){
	console.log('running : 8000');
})

