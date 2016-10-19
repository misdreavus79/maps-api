var fs = require('fs');
var express = require("express");
var app = express();
var port = 3000;
var siteName = "fit-for-the-cure";
var bodyParser = require('body-parser');
var TRACK_LOG = [];
var package = require('./package.json')

var name = package.name.replace('@imp/','');
app.use('/'+ name, express.static(__dirname + '/public'));

//app.use(express.static(__dirname));
//app.use('/'+__dirname, express.static('public'));


app.use(bodyParser.json());

app.post('/tracking', function (req, res) {

	if(TRACK_LOG.indexOf(req.body.str)==-1){
		console.log(JSON.stringify(req.body.str));
		TRACK_LOG.push(req.body.str);
	}
	res.end();
});

app.post('/restartLog', function (req, res) {
	TRACK_LOG = [];
	fs.writeFile('dev/trackingLog', '');
	res.end();
});

app.post('/printLog', function (req, res) {
	//TRACKING_STARTED = false;
	res.end();

	TRACK_LOG.sort();
	var str = TRACK_LOG.join('\n');

	// Write XML to file
	fs.writeFile('dev/trackingLog', str);
});

app.listen(port, function() {
	console.log("Listening on " + port);
});
