function searchYT(){
			var search=$('#search').val();
			var num=$('#num_of_results').val();
			$('#content').html('');
			d3.select('svg').selectAll('*').remove();
			d3.select('#visualisation').selectAll('svg').remove();
			$('#loading').css('display','block');
			$('#visualisation').css('display','none');
			$.ajax({
			    url: '/search', 
			    type: 'POST', 
			    contentType: 'application/json', 
			    data: JSON.stringify({search:search,num:num})
				}).done(function(data){
				if (data.error){
					$('#loading').css('display','none');
					$('#error').html(data.error);
				}
				else{
					$('#loading').css('display','none');
					$('#visualisation').css('display','block');
					
					for(vid in data){
						$('#content').append("<div class='vid'><img src='images/temp/"+data[vid].id+".png'/><br><span class='rating' >Likes/Dislikes: "+data[vid].likes+"/"+data[vid].dislikes+" - <strong>"+Math.floor(Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100)+"%</strong></span><br><span class='analysis'>Red: "+data[vid].analysis.red+" | Green: "+data[vid].analysis.green+" | Blue: "+data[vid].analysis.blue+" | Brightness: "+data[vid].analysis.brightness+"</span></div>");
					}

					var margin = {top: 20, right: 20, bottom: 30, left: 40},
					    width = 960 - margin.left - margin.right,
					    height = 500 - margin.top - margin.bottom;

					

					var reds=[];
	                var greens=[];
	                var blues=[];
	                var brightnesses=[];
	                data.sort(function(a,b){
	                	return Number(a.likes)/(Number(a.likes)+Number(a.dislikes))*100-Number(b.likes)/(Number(b.likes)+Number(b.dislikes))*100
	                })
	                for(vid in data){
	                	reds.push({
	                		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
	                		value:Number(data[vid].analysis.red)
	                	});

	                	greens.push({
	                		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
	                		value:Number(data[vid].analysis.green)
	                	});
	                	
	                	blues.push({
	                		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
	                		value:Number(data[vid].analysis.blue)
	                	});
	                	
	                	brightnesses.push({
	                		rating:Number(data[vid].likes)/(Number(data[vid].likes)+Number(data[vid].dislikes))*100,
	                		value:Number(data[vid].analysis.brightness)
	                	});
	                	
	                }
	               
	               

	               
	                var dot_width=6;
					// setup x 
					var xValue = function(d) { return d.rating;}, // data -> value
					    xScale = d3.scale.linear().range([0, width]), // value -> display
					    xMap = function(d) { console.log(xValue(d));return xScale(xValue(d));}, // data -> display
					    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

					// setup y
					var yValue = function(d) { return d.value;}, // data -> value
					    yScale = d3.scale.linear().range([height, 0]), // value -> display
					    yMap = function(d) { return yScale(yValue(d));}, // data -> display
					    yAxis = d3.svg.axis().scale(yScale).orient("left");

					// setup fill color
					var cValue = function(d) { return d.Manufacturer;},
					    color = d3.scale.category10();

					// add the graph canvas to the body of the webpage
					var svg = d3.select("#visualisation").append("svg")
					    .attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom)
					  	.append("g")
					    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					// var red=d3.selectAll('.red')
	    //            .data(reds)
	    //            .enter().append('g')
	    //            .attr('class','red');
					// // add the tooltip area to the webpage
					// var tooltip = d3.select("body").append("div")
					//     .attr("class", "tooltip")
					//     .style("opacity", 0);

					// // load data
					// d3.csv("cereal.csv", function(error, data) {

					//   // change string (from CSV) into number format
					//   data.forEach(function(d) {
					//     d.Calories = +d.Calories;
					//     d["Protein (g)"] = +d["Protein (g)"];
					// //    console.log(d);
					//   });

					//   // don't want dots overlapping axis, so add in buffer to data domain
					  xScale.domain([d3.min(reds, xValue)-1, d3.max(reds, xValue)+1]);
					  yScale.domain([0, 100]);

					  // x-axis
					  svg.append("g")
					      .attr("class", "x axis")
					      .attr("transform", "translate(0," + height + ")")
					      .call(xAxis)
					    .append("text")
					      .attr("class", "label")
					      .attr("x", width)
					      .attr("y", -6)
					      .style("text-anchor", "end")
					      .text("Percent Liked of Total Ratings");

					  // y-axis
					  svg.append("g")
					      .attr("class", "y axis")
					      .call(yAxis)
					    .append("text")
					      .attr("class", "label")
					      .attr("transform", "rotate(-90)")
					      .attr("y", 6)
					      .attr("dy", ".71em")
					      .style("text-anchor", "end")
					      .text("Values");



					      var lineGen = d3.svg.line()
	                        .x(function(d) {
	                            return xScale(d.rating);
	                        })
	                        .y(function(d) {
	                            return yScale(d.value);
	                        })
	                        .interpolate("basic");
	                    svg.append('svg:path')
	                        .attr('d', lineGen(reds))
	                        .attr('stroke', 'red')
	                        .attr('stroke-width', 1)
	                        .attr('fill', 'none');

	                    svg.append('svg:path')
	                        .attr('d', lineGen(greens))
	                        .attr('stroke', 'green')
	                        .attr('stroke-width', 1)
	                        .attr('fill', 'none');

	                    svg.append('svg:path')
	                        .attr('d', lineGen(blues))
	                        .attr('stroke', 'blue')
	                        .attr('stroke-width', 1)
	                        .attr('fill', 'none');

	                    svg.append('svg:path')
	                        .attr('d', lineGen(brightnesses))
	                        .attr('stroke', 'yellow')
	                        .attr('stroke-width', 1)
	                        .attr('fill', 'none');

					  // draw dots
					  svg.selectAll(".red")
					      .data(reds)
					    .enter().append("rect")
					      .attr("class", "red")
					      // .attr("r", 3.5)
					      // .attr("cx", xMap)
					      // .attr("cy", yMap)
					      .attr('width',dot_width)
					      .attr('height',dot_width)
					      .attr("x", xMap)
					      .attr("y", yMap)
					      .style('fill','red')

					  svg.selectAll(".green")
					      .data(greens)
					      .enter().append("rect")
					      .attr("class", "green")
					      // .attr("r", 3.5)
					      // .attr("cx", xMap)
					      // .attr("cy", yMap)
					      .attr('width',dot_width)
					      .attr('height',dot_width)
					      .attr("x", xMap)
					      .attr("y", yMap)
					      .style('fill','green')

					  svg.selectAll(".blue")
					      .data(blues)
					      .enter().append("rect")
					      .attr("class", "blue")
					      // .attr("r", 3.5)
					      // .attr("cx", xMap)
					      // .attr("cy", yMap)
					      .attr('width',dot_width)
					      .attr('height',dot_width)
					      .attr("x", xMap)
					      .attr("y", yMap)
					      .style('fill','blue')

					  svg.selectAll(".brightness")
					      .data(brightnesses)
					      .enter().append("rect")
					      .attr("class", "brightness")
					      // .attr("r", 3.5)
					      // .attr("cx", xMap)
					      // .attr("cy", yMap)
					      .attr('width',dot_width)
					      .attr('height',dot_width)
					      .attr("x", xMap)
					      .attr("y", yMap)
					      .style('fill','yellow')


				}
			});

		}