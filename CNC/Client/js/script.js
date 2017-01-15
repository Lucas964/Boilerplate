var botnet = "../../../Botnet-API/api/";
botnet = "http://botnet.artificial.engineering/api/";
var mytoken = "9c5ddd54107734f7d18335a5245c286b";


//-----------------------------Sidebar----------------------------------------

// Initialisiere die Sidebar
var initialiseSidebar = function(){
	var menuitems = [].slice.call(document.querySelectorAll("menu a"));
    for (i = 0; i < menuitems.length; i++)
    {
    	//eventlistener damit sich etwas ändert wenn man klickt
        menuitems[i].onclick = function (e) {

			//console.log('I was clicked', this);

            links = document.querySelectorAll("menu a");
            for (i = 0; i < links.length; i++)
            {
            	//setzte das vorherige section attribut auf class=""
                links[i].setAttribute("class", "");
            }
            // die neue Section auf active
            this.setAttribute("class", "active");

            showSection(this.getAttribute("href"));
        };
    }
}


function showSection(id){
    var sections = document.querySelectorAll("main > section");
    for (i = 0; i < sections.length; i++)
    {
        sections[i].setAttribute("class", "");
    }

    section = document.querySelector(id);
    section.setAttribute("class", "active");
}



//-----------------------------FetchContent und Tabellen------------------------------------------------

var fetchContent = function(type){
	fetch(botnet+type).then((response)=> {
	return response.json();
}).then(function(json){
	if(type=="Status"){
		insertStatusContent(json);
	}else if(type =="Tasks"){
		insertTaskContent(json);
	}else{
        console.log("Error bei fetchContent: Unbekannter API Aufruf");

	}
});
}


var insertTaskContent= function (data){
	var text ="";
	var tableTaskData = document.querySelector('#tasks-overview tbody')

	for(i=0;i<data.length;i++){
		var row = data[i];
		text += "<tr>";
		text += "<td>" + row.id + "</td>";
		text += "<td>" + row.type + "</td>";
		text += "<td>" + row.data.input + "</td>";
		text += "<td>" + row.data.output + "</td>";
		text += "</tr>";
	}
	tableTaskData.innerHTML = text;
}
var insertStatusContent = function (data){
	var out = "";
	var tableStatusData = document.querySelector("#status-overview tbody");

	for(i=0;i<data.length;i++){
		out += "<tr>";
        row = data[i];
        out += "<td>" + row.id + "</td>";
        out += "<td>" + row.ip + "</td>";
        out += "<td>" + row.task + "</td>";
        out += "<td>" + row.workload + "</td>";
        out += '<td>';
        if (row.workload === 0)
            out += '<input type="button" name="Start" value="Start" class="start" onclick="changeStatus(' + row.id + ',true)"/>';
        else
            out += '<input type="button" name="Stop" value="Stop" class="stop" onclick="changeStatus(' + row.id + ',false)" />';
        out += '</td>';
        out += "</tr>";
	}
	tableStatusData.innerHTML = out;
}
//-----------------------Posts------------------------------------------------
var changeStatus = function (id, status){
    var data = {"id": id, "status": status};
    posts("Status", JSON.stringify(data), function() {fetchContent('Status')});
}

var sendTaskForm = function (e) {
    var data = {"type":document.getElementById("type").value, "data":  {"input": document.getElementById("datainput").value}};
    posts("Tasks", JSON.stringify(data), function() {fetchContent('Tasks')});
    console.log(data);
    e.preventDefault();
}



var posts = function(api, json, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', botnet+api, true);
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('token', mytoken);

    xhr.onload = function (e) {
        if (this.status == 200){
            var data = xhr.response;
            if(data!==null&&data.message!="OK"){
                alert("ERROR");
            }else{
                callback();
            }
        }

    };
    xhr.send(json);
}

var bindform = function(){
    var formTasks = document.querySelector("#form");
    formTasks.addEventListener("submit", function(e){sendTaskForm(e);});
}
//----------------------------------------------------------------------

// (function(){
	fetchContent('Status');
	fetchContent('Tasks');
	initialiseSidebar();
    bindform();
// })();



