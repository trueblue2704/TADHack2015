var catapult = require("node-bandwidth");
var Client = require('node-wolfram');
var Wolfram = new Client('TRR8TK-XJTTAVAGXU');


var client = new catapult.Client("userId", "apiToken", "apiSecret");

catapult.Client.globalOptions.apiToken = "t-pdbvtsbm7crefjscsduudxa";
catapult.Client.globalOptions.apiSecret = "zld5gfwxkaclimz2fjm2hzptxol5bwf4cdjujty";
catapult.Client.globalOptions.userId = "u-m53dmzwgoxverwlyhah7wpa";

function getAnswer(question, replyTo, messageFrom) {
	question = question.split(']');
	question = question[1];
	//question = 
	console.log("Question: " + question);
	message = '';
	Wolfram.query(question, function(err, result) {
		console.log(result);
		if(err) {
			console.log(err);
			message = "Err: Sorry, your query didn't turn up any results.";
		}
		else if(result.queryresult.$.numpods=='0'){
			console.log("No results");
			message = "Sorry, your query didn't turn up any results.";
		}
		else {
			for(var a=0; a<result.queryresult.pod.length; a++){
				var pod = result.queryresult.pod[a];
				if(pod.subpod[0].plaintext[0]!=''){
					message = message + pod.$.title+":\n ";
					for(var b=0; b<pod.subpod.length; b++){
						var subpod = pod.subpod[b];
						for(var c=0; c<subpod.plaintext.length; c++){
						    var text = subpod.plaintext[c];
						    if(message.length+text.length+2 > 1600)
						    	break;
						    message = message + text +"\n";
						}
					}
				}
			}
		}
		console.log(message);
		for(i = 0; i < message.length; i+=150)
			catapult.Message.create({from: messageFrom, to: replyTo, text: message.substring(i, i+150)}, function(err, message){
				if(err){
    				return console.error(err.message);
  				}
  					console.log("Message id is " + message.id);});
  			});
}	
exports.getAnswer = getAnswer;