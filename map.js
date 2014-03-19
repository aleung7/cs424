var state_svg = d3.select("body")
				.append("svg")
				.attr("id", "states")
				
var map_width = 580,
	map_height = 320;


state_svg.attr("width", map_width)
		.attr("height", map_height);

var div_country = d3.select("body").append("div").attr("class","tooltip").attr("class", "label").style("opacity",0)

var country_svg = d3.select("body").append("svg").attr("id", "countries")

country_svg.attr("width", 600)
				.attr("height", 700)
				
d3.csv("/data_csv/import_state.csv", function(import_trade){		
	d3.csv("/data_csv/country_export.csv", function(data){
		var trades = {};
		var numbers = [];
		import_trade.forEach(function(d){
			if(d.abbreviatn === "World"){
				if(d.statename !== "UNIDENTIFIED" && d.statename !== "VIRGIN ISLANDS" && d.statename !== "PUERTO RICO"){
					trades[d.statename.toLowerCase()] = d.val2012;
					numbers.push(d.val2012)
				}
			}
		})
	
		console.log(data)
		
		var states = data.map(function(state){
			return {state: state.statename};
		})
		
		console.log(states)
		
		var color = d3.scale.quantize()
							.domain([d3.min(numbers, function(d){return +d;}), d3.max(numbers, function(d){return +d;})])
							.range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)",
									"rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)"])
							
		var div = d3.select("body").append("div").attr("class","tooltip").attr("class", "label").style("opacity",0)
		
		d3.json("world-countries.json", function(country){
			d3.json("us.json",function(us){
					var projection_usa = d3.geo.albersUsa()
										.translate([300, 150])
										.scale([650]);

					var path_usa = d3.geo.path()
						.projection(projection_usa);
			

					state_svg.selectAll("path")
							.data(us.features)
							.enter()
							.append("path")
							.attr("class", function(d){return "state " + d.properties.name.toLowerCase();})
							.attr("d",path_usa)
							.attr("fill", function(d){
								return color(trades[d.properties.name.toLowerCase()]);
							})
							.attr("stroke", "#CCC")
							.on("click", function(d){
									d3.select(this).transition().duration(200).attr("fill", "red")
									// div_country.transition().duration(500).style("opacity", 9)
									for(var i = 0; i < data.length; i++){
										if(d.properties.name.toLowerCase() === data[i]["statename"].toLowerCase()){
											if(data[i]["countryd"] !== "World" && data[i]["countryd"] !== "Top 25"){
												d3.select("path.country." + data[i]["countryd"].toLowerCase()).transition().duration(100).attr("fill","red")
												// div_country.html(data[i]["countryd"] + ": " + data[i]["val2012"])
	// 												.style("left", "500px")
	// 												.style("top", "500px")
											}
										}
									}
								
									div.transition()
										.duration(500)
										.style("opacity",9);
							
									div.html(trades[d.properties.name.toLowerCase()])
										.style("top", (d3.mouse(this)[1]) + "px")
										.style("left", (d3.mouse(this)[0] - 100) + "px")
									
									state_svg.selectAll("path.state").data(us.features).attr("fill",function(state){
											if(state.properties.name.toLowerCase !== state){
												return color(trades[state.properties.name.toLowerCase()])
											}
										})
							
							})
												
							d3.select("#reset").on("click", function(){
								state_svg.selectAll("path.state").data(us.features).attr("fill",function(d){
									return color(trades[d.properties.name.toLowerCase()])
								})
								d3.selectAll("path.country").attr("fill", "#777")
								div.transition()
									.duration(500)
									.style("opacity",0);
							})
							
							var projection = d3.geo.equirectangular()
												.translate([300, 550])
												.scale(100);

							var path = d3.geo.path()
											.projection(projection)

							country_svg.selectAll("path.countries")
								.data(country.features)
								.enter()
								.append("path")
								.attr("class",function(d){return "country " + d.properties.name.toLowerCase();})
								.attr("d",path)
								.attr("fill", "#777")
								.attr("stroke", "#CCC")
								.on("mouseover", function(d){
									
								})	
			});
		});
	});
});

				
// d3.json("world-countries.json", function(country){
// 	var projection = d3.geo.equirectangular()
// 						.translate([300, 550])
// 						.scale(100);
// 
// 	var path = d3.geo.path()
// 					.projection(projection)
// 
// 	country_svg.selectAll("path.countries")
// 		.data(country.features)
// 		.enter()
// 		.append("path")
// 		.attr("class",function(d){return "country " + d.properties.name.toLowerCase();})
// 		.attr("d",path)
// 		.attr("fill", "#777")
// 		.attr("stroke", "#CCC")
// 		.on("mouseover", function(d){
// 			console.log(d3.select(this).attr("fill") === "#ff0000")	
// 			if(d3.select(this).attr("fill") === "#ff0000"){
// 				div_country.transition().duration(500).style("opacity",9)
// 				for(var i = 0; i < us.features; i++){
// 					if(d3.select("path.state." + us.features[i].properties.name) === "#ff0000"){
// 						
// 					}
// 				}
// 			}
// 		})	
// 	
// });