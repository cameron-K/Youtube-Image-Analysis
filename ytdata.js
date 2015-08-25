var request=require('request');
var ACCESS_TOKEN='AIzaSyAo2ooYojW8vs_uMdfuNSJcYGgL7Eed9j4';

request.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=ambient&type=video&key='+ACCESS_TOKEN,function(err,header,body){
		if (err) throw err
		console.log(body);
})




