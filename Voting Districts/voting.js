
var width = 500;
var height = 850;
var margin = {top: 50, right: 50, left: 50, bottom: 50}

var column_header_array = [];//column_headers
var column_values = [];//value numbers after "VC"
var geo_id_headers = [];//headers in the GEO.id column in the metadata file


function create_data(data, column_name){		
		
		var svg = d3.select("body").append("svg")
								   .attr("width",width)
								   .attr("height",height)
		 	
		var x = d3.scale.linear()
					.domain([0, d3.max(data, function(d){ return parseInt(d[column_name]);})])
					.range([0, 300])
					
		var rect = svg.selectAll("rect")
		  			  .data(data)
		
		rect.enter()
		  	.append("rect")
		  	.attr("width", function(d){
			 		var rect_width;
					rect_width = isNaN(parseInt(d[column_name])) ? 0 : x(parseInt(d[column_name]));
					return rect_width;
			})
		  	.attr("y", function(d, i){ return (i + 1) * 10;})
		  	.attr("x", 70)
	  	    .attr("height", 5)
		
		var text_value = svg.selectAll("text.values")
								.data(data)
		text_value.enter()
				.append("text")
				.attr("class", "values")
				.attr("x", function(d){ 
					var text_width;
					text_width = isNaN(parseInt(d[column_name])) ? 0 : x(parseInt(d[column_name]))
					return 70 + text_width;})
				.attr("y", function(d, i){ return (i + 1) * 10 + 5;})
				.attr("font-size", 9)
				.attr("fill", "red")
				.text(function(d){ return d[column_name];})
				
		svg.selectAll("text.name")
				.data(data)
				.enter()
				.append("text")
				.attr("class","name")
				.text(function(d){return d["GEO.display-label"]})
				.attr("y", function(d, i){ return (i + 1) * 10 + 5;})
				.attr("font-size", 9)			
		
		svg.select("text.values")
			.attr("x", 70)
		
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
			};
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
				.text(function(d){ return d + " | ";})
				.on("click", function(e, i){
							d3.selectAll("svg").remove();
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
		.selectAll("a")
		.data(folder_names)
		.enter()
		.append("a")
		.text(function(d){ return d + " | ";})
		.on("click", function(d, i){
			d3.selectAll("svg").remove()
			d3.selectAll("div#column_values").remove()
			load_data(d,file_numbers[folder_names.indexOf(d)]);
			column_values.splice(0, column_values.length)
			geo_id_headers.splice(0, geo_id_headers.length)
		})
		
}

getData();

