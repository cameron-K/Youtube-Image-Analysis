function searchYT(){
			var search=$('#search').val();
			$('#content').html('');
			d3.select('svg').selectAll('*').remove();
			$('#loading').css('display','block');
			$.ajax({
			    url: '/search', 
			    type: 'POST', 
			    contentType: 'application/json', 
			    data: JSON.stringify({search:search})
				}).done(function(data){
				$('#loading').css('display','none');
				
				for(vid in data){
					$('#content').append("<div class='vid'><img src='images/temp/"+data[vid].id+".png'/><br><span class='rating' >Likes/Dislikes: "+data[vid].likes+"/"+data[vid].dislikes+" - <strong>"+Math.floor(Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100)+"%</strong></span><br><span class='analysis'>Red: "+data[vid].analysis.red+" | Green: "+data[vid].analysis.green+" | Blue: "+data[vid].analysis.blue+" | Brightness: "+data[vid].analysis.brightness+"</span></div>");
				}

				function InitChart() {
                    var red=[];
                    var green=[];
                    var blue=[];
                    var brightness=[];
                    data.sort(function(a,b){
                    	return Number(a.likes)/(Number(a.likes)+Number(a.dislikes))*100-Number(b.likes)/(Number(b.likes)+Number(b.dislikes))*100
                    })
                    for(vid in data){
                    	red.push({
                    		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
                    		value:Number(data[vid].analysis.red)
                    	});

                    	green.push({
                    		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
                    		value:Number(data[vid].analysis.green)
                    	});
                    	
                    	blue.push({
                    		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
                    		value:Number(data[vid].analysis.blue)
                    	});
                    	
                    	brightness.push({
                    		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
                    		value:Number(data[vid].analysis.brightness)
                    	});
                    	
                    }
                    var vis = d3.select("#visualisation"),
                        WIDTH = 1000,
                        HEIGHT = 500,
                        MARGINS = {
                            top: 20,
                            right: 20,
                            bottom: 40,
                            left: 60
                        },
                        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([red[0].rating, red[data.length-1].rating]),
                        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, 100]),
                        xAxis = d3.svg.axis()
                        .scale(xScale),
                        yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");
                        
                    d3.select('svg').append("text")
					    .attr("class", "x label")
					    .attr("text-anchor", "end")
					    .attr("x", 1000)
					    .attr("y", 500 - 6)
					    .text("Percent Liked (%)");

					d3.select('svg').append("text")
					    .attr("class", "y label")
					    .attr("text-anchor", "end")
					    .attr("y", 15)
					    .attr("dy", ".75em")
					    .attr("transform", "rotate(-90)")
					    .text("RGB and Brightness values 0-100");
                    
                    vis.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                        .call(xAxis);
                    vis.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
                        .call(yAxis);
                    var lineGen = d3.svg.line()
                        .x(function(d) {
                            return xScale(d.rating);
                        })
                        .y(function(d) {
                            return yScale(d.value);
                        })
                        .interpolate("basis");
                    vis.append('svg:path')
                        .attr('d', lineGen(red))
                        .attr('stroke', 'red')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');
                    vis.append('svg:path')
                        .attr('d', lineGen(green))
                        .attr('stroke', 'green')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');
                    vis.append('svg:path')
                        .attr('d', lineGen(blue))
                        .attr('stroke', 'blue')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');
                    vis.append('svg:path')
                        .attr('d', lineGen(brightness))
                        .attr('stroke', 'yellow')
                        .attr('stroke-width', 2)
                        .attr('fill', 'none');
                }
                
				InitChart();
			});

		}