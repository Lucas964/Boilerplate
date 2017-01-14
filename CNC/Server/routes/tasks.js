var fs = require('fs');

var tasks;
var types = ["hash-sha256", "hash-md5", "crack-md5"];

fs.readFile('tasks.json', (err, data) => {
	if(err) console.log(err);
	task=JSON.parse(data);
});


module.exports = function (router, tokens){
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
};










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