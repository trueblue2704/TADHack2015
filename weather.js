var request = require('request');
var catapult = require("node-bandwidth");

var client = new catapult.Client("userId", "apiToken", "apiSecret");

catapult.Client.globalOptions.apiToken = "t-pdbvtsbm7crefjscsduudxa";
catapult.Client.globalOptions.apiSecret = "zld5gfwxkaclimz2fjm2hzptxol5bwf4cdjujty";
catapult.Client.globalOptions.userId = "u-m53dmzwgoxverwlyhah7wpa";

function sendGETRequest(query, replyTo, messageFrom){
	var url = "http://query.yahooapis.com/";

	var options= {
		hostname: 'query.yahooapis.com',
		path: query,
		method: 'GET'
	};

	request(url + query, function(error, response, body) {
          console.log(body);
          temp = JSON.parse(body);
          console.log(temp);
          str = temp['query']['results']['channel']['item']['description'];
		  str=str.replace(/<br>/gi, "\n");
		  str=str.replace(/<p.*>/gi, "\n");
		  str=str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, "\n");
		  str=str.replace(/<(?:.|\s)*?>/g, "");
		  str = str.substring(2, str.length - 20);
		  console.log(str);
          console.log(temp['query']['results']['channel']['item']['description']);
          
          for(i = 0; i < str.length; i+=150)
			catapult.Message.create({from: messageFrom, to: replyTo, text: str.substring(i, i+150)}, function(err, message){
				if(err){
    				return console.error(err.message);
  				}
  					console.log("Message id is " + message.id);});
  			});

}

function getWeather(text, replyTo, messageFrom){
 	var getQuery = "select * from weather.forecast where woeid in";
 	getQuery += "(select woeid from geo.places(1) where text=\"";
 	temp = text.split(']');
 	getQuery += temp[1];
 	getQuery +="\")";

 	console.log('Weather Query:' + getQuery);

 	var encodedQuery = encodeURI(getQuery);
	
	var yahooGetQuery = "/v1/public/yql?q=";
	yahooGetQuery += encodedQuery;
	yahooGetQuery += "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

	console.log('Yahoo Weather Query: '+ yahooGetQuery);

	sendGETRequest(yahooGetQuery, replyTo, messageFrom); 

}

exports.getWeather = getWeather;