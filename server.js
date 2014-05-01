var http = require("http"); 
var cheerio = require("cheerio"); 

var server = http.createServer(function(req, res){

	var req_opts = {
		host:"en.wikipedia.org",
		path:"/wiki/London"
	};
	var response_text = " ";

	var request = http.request(req_opts, function(resp) {
		if(resp.statusCode != 200) {
			throw "Error: " + resp.statusCode;
		};
		resp.setEncoding("utf8"); 
		resp.on("data", function (chunk) { 
			response_text += chunk; 
		});
		resp.on("end", function(){


		$ = cheerio.load(response_text);

		res.writeHead(200, {"Content-Type": "text/html"}); 
		res.write("<html><head><meta charset='UTF-8' />"); 
		res.write("</head><body><table>"); 
		$("table.geography tr").each(function(tr_index, tr) {
		 var th_text = $(this).find("th").text(); 
		 var prop_name = th_text.trim().toLowerCase().replace(/[^a-z]/g,""); 
		 	if({"country":1, "mayor":1, "elevation":1}[prop_name])
		 	{
		 		res.write("<tr><th>" + prop_name + "</th><td>"); 
		 		res.write($(this).find("td").text()); 
		 		res.write("</td></tr>"); 
		 	}
		});
		res.end("</table></body></html>");
	})
})
	request.on("error", function(e){
		throw "Error: " + e.message;
	});
	request.end();
}).listen(8080);