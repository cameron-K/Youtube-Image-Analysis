module.exports=(function(){
	var request=require('request');
	var resemble=require('node-resemble-js');
	var url='http://cameronkilner.com/images/ppl16.jpg';
	var ACCESS_TOKEN='AIzaSyAo2ooYojW8vs_uMdfuNSJcYGgL7Eed9j4';
	var im = require('imagemagick');
	var fs=require('fs');

	return{
		searchYT:function(req,res){
			
			var vid_objs=[];
			var search=encodeURI(req.body.search);

			var url_string='https://www.googleapis.com/youtube/v3/search?part=id&q='+search+'&type=video&order=viewCount&maxResults=36&key='+ACCESS_TOKEN;
			request.get(url_string,function(err,header,body){
				if (err) throw err;

				var stuff=JSON.parse(body);
				var videos=[];
				var videoIds=[];

				videos=stuff.items;

				for(vid in videos){
					videoIds.push(videos[vid].id.videoId);
				}

				request.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id='+videoIds.join(",")+'&type=video&key='+ACCESS_TOKEN,function(err,header,body){

					var stuff=JSON.parse(body);
					var videos=[];
					videos=stuff.items;

					for(vid in videos){
						vid_objs.push({
							id:videos[vid].id,
							thumb:videos[vid].snippet.thumbnails.default.url,
							likes:videos[vid].statistics.likeCount,
							dislikes:videos[vid].statistics.dislikeCount,
							analysis:{}
						})
					}

					analyze(vid_objs);


				});
				function analyze(vid_objs){
					var complete=0;
					for(vid in vid_objs){
						
						closure(vid,vid_objs);
						function closure(vid,vid_objs){
							var destination=fs.createWriteStream('public/images/temp/'+vid_objs[vid].id+'.jpg');

							 destination.on('error', function (err) {
							    console.log(err);
							  });
							request(vid_objs[vid].thumb).pipe(destination).on('finish',function(){


								im.convert(['public/images/temp/'+vid_objs[vid].id+'.jpg', 'public/images/temp/'+vid_objs[vid].id+'.png'], 
								function(err){
									if (err) throw err
									fs.readFile('public/images/temp/'+vid_objs[vid].id+'.png', function (err, imgData) {
										complete++;
										if (err) throw err;
										var api = resemble(imgData).onComplete(function(data){
											vid_objs[vid].analysis=data;

											if(complete>=vid_objs.length){
												// for(vid in vid_objs){
												// 	// fs.unlink('public/images/'+vid_objs[vid].id+'.png',function(err){
												// 	// 	if (err) throw err;
												// 	// })
												// 	fs.unlink('public/images/'+vid_objs[vid].id+'.jpg',function(err){
												// 		if (err) throw err;
												// 	})
												// }
												res.json(vid_objs);
											}
										});
									});
									
								})
							});
						}

					}
					
				}
			});


		}
	}
	
})();