var width = 200;
var height = 850;
var margin = {top: 50, right: 50, left: 50, bottom: 50}

var column_header_array = [];//column_headers
var column_values = [];//value numbers after "VC"
var geo_id_headers = [];//headers in the GEO.id column in the metadata file

var county_rows = [];
var district_rows = [];

var map_svg = d3.select("body")
				.append("svg")
				.attr("id", "map")
				
function create_map(){	
	var map_width = 560//960,
	    map_height = 460//660;

	map_svg.attr("width", map_width)
	    	.attr("height", map_height);
						
	var readout = d3.select("body").append("div")
		.attr("id", "readout")
		.style("position", "absolute")
		.style("top", 20 + "px")
	
	var readout_title = readout.append("h1").attr("id", "country_name")


	//var projection = d3.geo.mercator();
	    //.scale(500)
	    //.translate([width / 2, height / 2]);

	var projection = d3.geo.albers()
		.center([0, 18.5])//0, 18.5
		.rotate([157.50, -1.5])
		.parallels([15, 25])//15, 25
		.scale(5500)
		.translate([map_width / 2, (map_height / 2) + 50]);
	
	var path = d3.geo.path()
	    .projection(projection);


	// var c_data = "#222";
	// var c_nodata = "#EEE";
	// 
	// var catchshares = {}
	// d3.csv("WorldCatchShareDataBase.csv", function(raw_catchshares) {
	// 	
	// 	catchshares = d3.nest().key(function(d) {return d.FIPS }).map(raw_catchshares);
	// 	console.log(catchshares);
	
		d3.json("hawaii_voting_districts_topo.json", function(error, hawaii) {
			
			map_svg.selectAll("path.district")
			    .data(topojson.feature(hawaii, hawaii.objects.hawaii_voting_districts).features)
			  .enter().append("path")
			    .attr("class", function(d) { 
					var desc = d.id.split("-"); 
					if(desc[0][0] === "0"){
						desc[0] = desc[0].slice(1);
					}
					return "district" + desc[0]; 
				})
			    .attr("d", path)
				.on("mouseover", function(d) {
		//			console.log(d)
					//d3.select(this).attr("fill", "red")
					readout_title.text(d.id)
					var desc = d.id.split("-")
					if(desc[0][0] === "0"){
						desc[0] = desc[0].slice(1);
					}
					d3.select(this).attr("stroke", "orange").attr("stroke-width", 1.5)
					d3.selectAll("rect.district.HD" + desc[0])
						.transition()
						.duration(200)
						.attr("fill", "red")
						.attr("fill-opacity", 1);
					d3.select(this).attr("class", "district" + desc[0] + desc[1])
					d3.selectAll("path.district" + desc[0])
						.transition()
						.duration(200)
						.attr("fill", "red")
					d3.selectAll("path.inset" + desc[0])
						.transition()
						.duration(200)
						.attr("fill", "red")
						
					// cs_data = catchshares[d.id] === undefined ? [] : catchshares[d.id] 
					// data_lines = readout_table.selectAll("tr")
					// 	.data(cs_data)
					// 	.enter()
					// 	.append("tr");
					// 
					// data_cells = data_lines.selectAll("td")
					// 	.data(function(cs) { 
					// 		return [cs["Fishery / Program Name"], cs["Program Type"], cs["Taxonomic Name - Genus "], cs["Taxonomic Name - species "]]
					// 	}).enter()
					// 	.append("td")
					// 	.text(function(property) {return property});

				
				})
				.on("mouseout", function(d) {
					d3.select(this).attr("stroke", "gray").attr("stroke-width", 0)
					d3.select(this).attr("fill", "black");
					readout_title.text("")
					var desc = d.id.split("-")
					if(desc[0][0] === "0"){
						desc[0] = desc[0].slice(1);
					}
					d3.selectAll("rect.district.HD" + desc[0]).transition()
							.duration(200)
							.attr("fill", "green")
							.attr("fill-opacity", 0.5);
					d3.select(this).attr("class", "district" + desc[0])
					d3.selectAll("path.district" + desc[0])
						.transition()
						.duration(200)
						.attr("fill", "black")
					d3.select("svg#map_projection").remove();
					d3.selectAll("path.inset" + desc[0])
						.transition()
						.duration(200)
						.attr("fill", "black")
				});

		});
}

function create_inset(){
	var inset_width = 560,
	 	inset_height = 460;

	var inset_svg = d3.select("body")
						.append("svg")
						.attr("id", "inset")
						.attr("width", inset_width)
						.attr("height", inset_height)
	
	var projection = d3.geo.albers()
						.center([0, 18.5])
						.rotate([157.967, -2.941])
						.scale(41284)
						.translate([228, 199])
						
	var path = d3.geo.path()	
				.projection(projection)
	
	d3.json("hawaii_voting_districts_topo.json", function(error, hawaii) {
		
		inset_svg.selectAll("path.inset")
				 .data(topojson.feature(hawaii, hawaii.objects.hawaii_voting_districts).features)
				 .enter()
				 .append("path")
				 .attr("class", function(d) { 
					var desc = d.id.split("-"); 
					if(desc[0][0] === "0"){
						desc[0] = desc[0].slice(1);
					}
					return "inset" + desc[0]; 
				 })
				 .attr("d", path)
				
	})
}


function create_data(data, column_name){		
		
		var start_width = 80;
		
		for(var i = 2; i < 6; i++){
			county_rows.push(data[i])
		}
		
		district_rows.splice(0, district_rows.length);
		for(var i = 6; i < data.length; i++){
			district_rows.push(data[i])
		}
	
		var svg = d3.select("body").append("svg")
								   .attr("class", "graph")
								   .attr("width",width)
								   .attr("height",height)
								
		var x_hawaii_scale = d3.scale.linear()
								.domain([0, parseInt(data[1][column_name])])
								.range([0, width - 150])
								
		var x_county_scale = d3.scale.linear()
							  .domain([0, d3.max(county_rows, function(d){ return parseInt(d[column_name]);})])
							  .range([0, width - 100])
			
		var x_district_scale = 	d3.scale.linear()
								  .domain([0, d3.max(district_rows, function(d){ return parseInt(d[column_name]);})])
								  .range([0, width - 100])
		
		svg.append("rect")
			.attr("width", isNaN(parseInt(data[1][column_name])) ? 0 : x_hawaii_scale(parseInt(data[1][column_name])))
			.attr("y", 20)
			.attr("x", start_width)
			.attr("height", 5)

		var rect_counties = svg.selectAll("rect.counties")
				  			  .data(county_rows)
				
		rect_counties.enter()
		  	.append("rect")
			.attr("class","counties")
		  	.attr("width", function(d){
			 		var rect_width;
					rect_width = isNaN(parseInt(d[column_name])) ? 0 : x_county_scale(parseInt(d[column_name]));
					return rect_width;
			})
		  	.attr("y", function(d, i){ return (i + 3) * 10;})
		  	.attr("x", start_width)
	  	    .attr("height", 5)
			.attr("fill", "blue")
			.attr("fill-opacity", 0.5)

		svg.selectAll("rect.district")
					.data(district_rows)
					.enter()
					.append("rect")
					.attr("class", function(d){
						var desc = d["GEO.display-label"].split(" ")
						if(desc[0] === "House")
							return "district " + "HD" + desc[2];
					})
				  	.attr("width", function(d){
					 		var rect_width;
							rect_width = isNaN(parseInt(d[column_name])) ? 0 : x_district_scale(parseInt(d[column_name]));
							return rect_width;
					})
				  	.attr("y", function(d, i){ return (i + 7) * 10;})
				  	.attr("x", start_width)
			  	    .attr("height", 5)
					.attr("fill", "green")
					.attr("fill-opacity",0.5)
					.on("mouseover", function(d){
						var desc = d["GEO.display-label"].split(" ")
						if(desc[0] === "House"){
							d3.selectAll("rect.district.HD" + desc[2]).transition()
								.duration(200)
								.attr("fill", "red")
								.attr("fill-opacity", 1);
							d3.selectAll("path.district" + desc[2])
								.transition()
								.duration(200)
								.attr("fill", "red")
						}
						
					})
					.on("mouseout", function(d){
						var desc = d["GEO.display-label"].split(" ")
						if(desc[0] === "House"){
							d3.selectAll("rect.district.HD" + desc[2]).transition()
								.duration(200)
								.attr("fill", "green")
								.attr("fill-opacity", 0.5);
							d3.selectAll("path.district" + desc[2])
									.transition()
									.duration(200)
									.attr("fill", "black")
						}
					})

			
						 
		svg.append("text")
			.attr("x", start_width)
			.attr("y", 15)
			.attr("font-size", 9)
			.attr("fill", "red")
			.text(data[0][column_name])
			.attr("title", data[0][column_name])
		
		svg.append("text")
			.attr("x", start_width + (isNaN(parseInt(data[1][column_name])) ? 0 : x_hawaii_scale(parseInt(data[1][column_name]))))
			.attr("y", 25)
			.attr("font-size", 9)
			.attr("fill", "red")
			.text(data[1][column_name])
			
		var text_counties = svg.selectAll("text.counties")
									.data(county_rows)
		text_counties.enter()
				.append("text")
				.attr("class", "counties")
				.attr("x", function(d){ 
					var text_width;
					text_width = isNaN(parseInt(d[column_name])) ? 0 : x_county_scale(parseInt(d[column_name]))
					return start_width + text_width;})
				.attr("y", function(d, i){ return (i + 3) * 10 + 5;})
				.attr("font-size", 9)
				.attr("fill", "red")
				.text(function(d){ return d[column_name];})
					
		svg.selectAll("text.district")
			.data(district_rows)
			.enter()
			.append("text")
			.attr("class", "district")
			.attr("x", function(d){ 
				var text_width;
				text_width = isNaN(parseInt(d[column_name])) ? 0 : x_district_scale(parseInt(d[column_name]))
				return start_width + text_width;})
			.attr("y", function(d, i){ return (i + 7) * 10 + 5;})
			.attr("font-size", 9)
			.attr("fill", "red")
			.text(function(d){ return d[column_name];})
				
		svg.selectAll("text.name")
				.data(data)
				.enter()
				.append("text")
				.attr("class",function(d){
					var desc = d["GEO.display-label"].split(" ")
					if(desc[0] === "House")
						return "name " + "HD" + desc[2];
				})
				.text(function(d){return d["GEO.display-label"]})
				.attr("x", 10)
				.attr("y", function(d, i){ return (i + 1) * 10 + 5;})
				.attr("font-size", 9)	
				.on("mouseover", function(d){
					var desc = d["GEO.display-label"].split(" ")
					if(desc[0] === "House"){
						d3.selectAll("rect.district.HD" + desc[2]).transition()
							.duration(200)
							.attr("fill", "red")
							.attr("fill-opacity", 1);
						d3.selectAll("path.district" + desc[2])
							.transition()
							.duration(200)
							.attr("fill", "red")
					}
				})
				.on("mouseout", function(d){
					var desc = d["GEO.display-label"].split(" ")
					if(desc[0] === "House"){
						d3.selectAll("rect.district.HD" + desc[2]).transition()
							.duration(200)
							.attr("fill", "green")	
							.attr("fill-opacity", 0.5);
						d3.selectAll("path.district" + desc[2])
								.transition()
								.duration(200)
								.attr("fill", "black")
					}
				})		
		
}


/*
	This part of the code gets the header columns.
*/
function load_data(folder_name, file_number){
	d3.csv("/District ACS/"+folder_name+"/ACS_11_5YR_"+file_number+"_metadata.csv", function(data){
		//gets only the headers in GEO.id column 
		data.forEach(function(d){
			if(d3.keys(d)[0] === "GEO.id"){
				geo_id_headers.push(d["GEO.id"]);
			};.append(	
		})
	
		geo_id_headers = geo_id_headers.filter(function(d){
						var desc = d.split("_");
						return desc[0] === "HC01" || desc[0] === "HD01"
					})
	
		//gets only the value numbers after the "VC"
		geo_id_headers.forEach(function(d){
			var desc;
			if(d.indexOf("VC") === -1){
				desc = d.split("VD")
				column_values.push(desc[1])
			}else if(d.indexOf("EST") !== -1 || d.indexOf("MOE") !== -1){
				desc = d.split("_")
				column_values.push(desc[1] + " " + desc[2][2] + desc[2][3])
			}else{
				desc = d.split("VC")
				column_values.push(desc[1])
			}
		})
	
	
		//creates links of all the values. needed column_values to create all the value number links
		d3.csv("/District ACS/" + folder_name + "/ACS_11_5YR_" + file_number + "_with_ann.csv", function(data){
		
			//fix the text
			data.forEach(function(d){
				var geo_text;
				geo_text = d["GEO.display-label"].replace(/\,/g,"")
				geo_text = geo_text.split(" ")
				if(geo_text.length === 3){
					d["GEO.display-label"] = geo_text[0] + " " + geo_text[1]
				}else if(geo_text.length === 6){
					d["GEO.display-label"] = geo_text[1] + " " + geo_text[2] + " " + geo_text[3]
				}
			})
		
			var div = d3.select("body").append("div")
			
			div.attr("id", "column_values")
				.selectAll("a")
				.data(column_values)
				.enter()
				.append("a")
				.attr("href", "javascript:;")
				.text(function(d){ return d + " | ";})
				.on("click", function(e, i){
							d3.selectAll("svg.graph").remove();
							//just needed the headers. go through just one row to get the headers
							d3.keys(data[0]).forEach(function(d){
								var desc = d.split("_");
								if(desc[1] === "VC" + e){
									column_header_array.push(d);
								}else if(desc[1] === "VD" + e){
									column_header_array.push(d);
								}else if(desc[1] === "EST" || desc[1] === "MOE"){
									var click = e.split(" ")
									if(desc[1] === click[0] && (desc[2][2] + desc[2][3] === click[1])){
										column_header_array.push(d)
									}
								}
							})
						for(var i = 0; i < column_header_array.length; i++){
							//will go through each row
							create_data(data, column_header_array[i]);	
							county_rows.splice(0, county_rows.length);
							//district_rows.splice(0, district_rows.length);
						}
						column_header_array.splice(0, column_header_array.length)
				})
		})
	})
}

function getData(){
	var folder_names = ["demographics 1 - Household Composition", "demographics 2 - Language at Home", 
						"demographics 3 - Place of Birth (Foreign)", "demographics 4 - Place of Birth (Native)",
						"education 1 - enrollment", "education 2 - attainment", "employment income poverty",
						"housing", "transportation"];
	
	var file_numbers = ["S1101", "S1601", "B05006", "B05002", "S1401", "S1501", "DP03", "DP04", "S0801"];
	
	var div = d3.select("body").append("div")
		
	div.attr("id", "folder_names")
	
	div.selectAll("a.folder_name")
		.data(folder_names)
		.enter()
		.append("a")
		.attr("href", "javascript:;")
		.text(function(d){ return d + " | ";})
		.on("click", function(d, i){
			d3.selectAll("svg.graph").remove()
			d3.selectAll("div#column_values").remove()
			load_data(d,file_numbers[folder_names.indexOf(d)]);
			column_values.splice(0, column_values.length)
			geo_id_headers.splice(0, geo_id_headers.length)
		})
		
}

create_map();
create_inset();
getData();

