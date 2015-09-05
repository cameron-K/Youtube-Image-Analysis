module.exports=(function(){
	var request=require('request');
	var resemble=require('node-resemble-js');
	var url='http://cameronkilner.com/images/ppl16.jpg';
	var ACCESS_TOKEN='AIzaSyAo2ooYojW8vs_uMdfuNSJcYGgL7Eed9j4';
	var im = require('imagemagick');
	var fs=require('fs');

	return{
		searchYT:function(req,res){
			
			//array for holding the formatted data
			var vid_objs=[];

			//user entered- term and desired results
			var search=encodeURI(req.body.search);
			var num_of_results=req.body.num;
			
			//validate number
			if(!num_of_results||isNaN(num_of_results)){
				num_of_results=21;
			}
			else if(num_of_results>50||num_of_results<1){
				res.json({error:'Please enter a whole number less than 51'});
			}
			 
			
			//search for term, limit to num_of_results with Youtube API
			var url_string='https://www.googleapis.com/youtube/v3/search?part=id&q='+search+'&type=video&order=viewCount&maxResults='+num_of_results+'&key='+ACCESS_TOKEN;
			request.get(url_string,function(err,header,body){
				if (err) throw err;

				//json response
				var stuff=JSON.parse(body);

				//returned videos
				var videos=[];
				videos=stuff.items;

				//video ids
				var videoIds=[];

				

				for(vid in videos){
					//push video ids
					videoIds.push(videos[vid].id.videoId);
				}
				//request more details for the list of video ids
				request.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id='+videoIds.join(",")+'&type=video&key='+ACCESS_TOKEN,function(err,header,body){

					//json response
					var stuff=JSON.parse(body);

					//returned videos
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
					//pass video data objects
					analyze(vid_objs);


				});
				function analyze(vid_objs){
					//keeps track of how many objects have been fully processed
					var complete=0;
					for(vid in vid_objs){
						
						//closure to preserve the value of vid for each iteration through the callback chain
						closure(vid,vid_objs);
						function closure(vid,vid_objs){
							//create temp write stream for thumbnail
							var destination=fs.createWriteStream('public/images/temp/'+vid_objs[vid].id+'.jpg');

							 destination.on('error', function (err) {
							    console.log(err);
							  });
							//download and save thumbnail
							request(vid_objs[vid].thumb).pipe(destination).on('finish',function(){

								//convert jpg to png for resemble library
								im.convert(['public/images/temp/'+vid_objs[vid].id+'.jpg', 'public/images/temp/'+vid_objs[vid].id+'.png'], 
								function(err){
									if (err) throw err

									//read image data
									fs.readFile('public/images/temp/'+vid_objs[vid].id+'.png', function (err, imgData) {
										
										if (err) throw err;
										//perform RGB and brightness analysis for image
										var api = resemble(imgData).onComplete(function(data){
											vid_objs[vid].analysis=data;
											//increment after final step
											complete++;

											//if have processed all object, send data
											if(complete>=vid_objs.length){
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