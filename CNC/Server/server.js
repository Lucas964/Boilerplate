const express =require('express');
const cors = require('cors');
const bodyParser =require('body-parser');
var fs= require('fs');
const app = express();
const router = express.Router();

let bots;
let tasks;
var types = ["hash-sha256", "hash-md5", "crack-md5"];
var tokens = ["9c5ddd54107734f7d18335a5245c286b", "9c5ddd54107734f7d18335a5245c286a", "9c5ddd54107734f7d18335a5245c286c"];

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);


app.listen(3000, function() {
	console.log('Server mit Port 3000 geöffnet')
});


/* Alles für Status */


fs.readFile("bots.json", (err, data) =>{
	if (err) throw err;

	bots = JSON.parse(data);
});


	router.get('/Status', (req,res)=>{
		res.json(bots);
	});

	router.get('/Status/:id', (req,res)=>{
		idGefunden = false;

		for(var i = 0; i < bots.length; i++){
			if(bots[i].id == req.param.id){
				res.json(bots[i]);
				idGefunden = true;
			}
		}
		if(idGefunden == false){
			res.send('Bot nicht gefunden.');
		}
	});

	router.post('/Status', (req, res) =>{
		var validtoken = false;
		var idGefunden = false;
		//überprüfen ob das Token ok ist.
		validtoken=isInArray(req.headers.token, tokens);
		if(!validtoken){
			// 403 zur Angabe das Token nicht ok ist
			res.status(403);
		}
		else{
			res.status(200);
			for (var i = 0; i < bots.length; i++) {
				if(bots[i]==req.body.id){
					idGefunden=true;
				}
				if(req.body.status === true){
					bots[i].workload=1.0;
				}else{
					bots[i].workload=0.0
				}
				speicherBots();

			};
			if(idGefunden){
				res.json('OK');
			}else{
				res.json('NOT OK');
			}

		};
	});
	router.post('Status/:id', (req, res) => {
		var validtoken =false;
		var idGefunden =false;
		validtoken=isInArray(req.headers.token, tokens);
		if(!validtoken){
			res.status(403);
		}else{
			for (var i = 0; i < bots.length; i++) {
				var bot = bots[i];
				//modifiziere Bot
				if(bot.id == req.params.id){
					bot.ip = req.body.ip;
					bot.task = req.body.taks;
					bot.workload = req.body.workload;
					idGefunden=true;
					speicherBots();
				}
			}
		}
		if(idGefunden){
			res.json('OK');
		}else{
			res.json('NOT OK');
		}

	});

/* Alles für Tasks */

fs.readFile('tasks.json', (err, data) => {
	if(err) console.log(err);
	task=JSON.parse(data);
});


	router.get('/Tasks', (req, res) => {
		res.json(tasks);
	});

	router.get('/Tasks/:id', (req, res) =>{
		var idGefunden = false;
		for(var i = 0; i < tasks.length; i++){
			if(tasks[i].id == req.param.id){
				res.json(tasks[i]);
				idGefunden = true;
			}
		}
		if(idGefunden == false){
			res.send('Task nicht gefunden.');
		}
	});

	router.post('/Tasks/:id', (req, res) =>{
		var idGefunden = false;
		var validtoken = false;
		validtoken = isInArray(req.headers.token, tokens);
		if(!validtoken){
			res.status(403);
		}
		else{
			for( var i = 0; i < tasks.length; i++){
				if(tasks[i].id == req.params.id){
					if(isInArray(req.body.type, types)){
						tasks[i].type = req.body.type;
					}
					if(req.body.data){
						if(req.body.data.input){
							tasks[i].data.input = req.param.data.input;
						}
						if(req.body.data.output){
							tasks[i].data.output = req.param.data.input;
						}
					}

					idGefunden = true;
					speicherTasks();
				}
			}
		}
		if(idGefunden){
			res.json('OK');
		}else{
			res.json('NOT OK');
		}

	});



/* ausgelagerte Funktionen */

function speicherBots(){
	fs.writeFile('bots.json', JSON.stringify(bots), (err)=>{
		if(err) console.log(err);
	});
}

function speicherTasks(){
	fs.writeFile('tasks.json', JSON.stringify(bots), (err)=>{
		if(err) console.log(err);
	});
}

function isInArray(request, tokens){
	for(var i = 0; i<tokens.length; i++){
		if(tokens[i]==request){
			return true;
		}
	}
	return false;
}