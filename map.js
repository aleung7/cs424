var state_svg = d3.select("body")
				.append("svg")
				.attr("id", "states")
				
var map_width = 580,
	map_height = 320;


state_svg.attr("width", map_width)
		.attr("height", map_height);

d3.csv("/data_csv/country_export.csv", function(data){
	console.log(data)
	d3.json("us.json",function(us){
			var projection = d3.geo.albersUsa()
								.translate([300, 150])
								.scale([650]);

			var path = d3.geo.path()
				.projection(projection);
			
		
			state_svg.selectAll("path.states")
					.data(us.features)
					.enter()
					.append("path")
					.attr("class", function(d){return "state " + d.properties.name.toLowerCase();})
					.attr("d",path)
					.attr("fill", "#777")
					.attr("stroke", "#CCC")
					.on("mouseover", function(d){
						d3.select(this).transition().duration(200).attr("fill", "red")
						for(var i = 0; i < data.length; i++){
							if(d.properties.name.toLowerCase() === data[i]["statename"].toLowerCase()){
								if(data[i]["countryd"] !== "World" && data[i]["countryd"] !== "Top 25"){
									console.log(data[i]["countryd"])
									d3.select("path.country." + data[i]["countryd"].toLowerCase()).transition().duration(100).attr("fill","red")
								}
							}
						}
					})
					.on("mouseout", function(d){
						d3.select(this).transition().duration(200).attr("fill", "#777")
						for(var i = 0; i < data.length; i++){
							if(d.properties.name.toLowerCase() === data[i]["statename"].toLowerCase()){
								if(data[i]["countryd"] !== "World" && data[i]["countryd"] !== "Top 25"){
									console.log(data[i]["countryd"])
									d3.select("path.country." + data[i]["countryd"].toLowerCase()).transition().duration(100).attr("fill","#777")
								}
							}
						}
					})
	});
});

var country_svg = d3.select("body").append("svg").attr("id", "countries")

country_svg.attr("width", 800)
				.attr("height", 800)
				
d3.json("world-countries.json", function(country){
	var projection = d3.geo.equirectangular()
						.translate([400, 550])
						.scale(120);

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
	
});