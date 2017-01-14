var fs = require('fs');

var bots;

fs.readFile("bots.json", (err, data) =>{
	if (err) throw err;

	bots = JSON.parse(data);
});

module.exports = function(router, tokens){
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
};
//-------------------------ausgelagerte Funktionen---------------------------------
}
function speicherBots(){
	fs.writeFile('bots.json', JSON.stringify(bots), (err)=>{
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