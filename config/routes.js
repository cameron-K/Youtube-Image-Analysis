module.exports=function(app){
var search=require('../controller.js');

	app.post('/search',function(req,res){
		search.searchYT(req,res);
	});

}