var map_svg = d3.select("body")
				.append("svg")
				.attr("id", "map")
				
var map_width = 1280,
	map_height = 720;


var projection = d3.geo.albersUsa()
					.translate([300, 400])
					.scale([800]);

var path = d3.geo.path()
	.projection(projection);

map_svg.attr("width", map_width)
		.attr("height", map_height);
		
d3.json("us.json",function(json){
	console.log(json);
	
	map_svg.selectAll("path.states")
			.data(json.features)
			.enter()
			.append("path")
			.attr("class", "states")
			.attr("d",path)
			.attr("fill", "#777")
			.attr("stroke", "#CCC")
				
});


d3.csv("alabama.csv", function(data){
	console.log(data);

})

// d3.json("world-countries.json", function(json){
// 	
// 	var projection = d3.geo.azimuthalEqualArea()
// 						.translate([400, 500])
// 						.scale(100);
// 						
// 	var path = d3.geo.path()
// 					.projection(projection)
// 	
// 	console.log(json)
// 	map_svg.selectAll("path.countries")
// 		.data(json.features)
// 		.enter()
// 		.append("path")
// 		.attr("class", "countries")
// 		.attr("d",path)
// 		.attr("fill", "#777")
// 		.attr("stroke", "#CCC")	