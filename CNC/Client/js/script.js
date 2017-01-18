let botnet = "../../../Botnet-API/api/";
botnet = "http://botnet.artificial.engineering/api/";
let mytoken = "9c5ddd54107734f7d18335a5245c286b";


//-----------------------------Sidebar----------------------------------------

// Initialisiere die Sidebar
let initialiseSidebar = function() {
	let menuitems = [].slice.call(document.querySelectorAll("menu a"));
	for (let i = 0; i < menuitems.length; i++) {
		//eventlistener damit sich etwas ändert wenn man klickt
		menuitems[i].onclick = function (e) {

			//console.log('I was clicked', this);

			let links = document.querySelectorAll("menu a");
			for (let i = 0; i < links.length; i++) {
				//setzte das vorherige section attribut auf class=""
				links[i].setAttribute("class", "");
			}
            // die neue Section auf active
			this.setAttribute("class", "active");

			showSection(this.getAttribute("href"));
		};
	}
};

let showSection = function(id) {
	let sections = document.querySelectorAll("main > section");
	for (let i = 0; i < sections.length; i++) {
		sections[i].setAttribute("class", "");
	}

	let section = document.querySelector(id);
	section.setAttribute("class", "active");
};



//-----------------------------FetchContent und Tabellen------------------------------------------------

let fetchContent = function(type) {
	fetch(botnet + type).then((response)=> {
		return response.json();
	}).then(function(json) {
		if (type === "Status") {
			insertStatusContent(json);
		} else if (type === "Tasks") {
			insertTaskContent(json);
		} else {
			console.log("Error bei fetchContent: Unbekannter API Aufruf");

		}
	});
};


let insertTaskContent = function (data) {
	let text = "";
	let tableTaskData = document.querySelector('#tasks-overview tbody');

	for (let i = 0; i < data.length; i++) {
		let row = data[i];
		text += "<tr>";
		text += "<td>" + row.id + "</td>";
		text += "<td>" + row.type + "</td>";
		text += "<td>" + row.data.input + "</td>";
		text += "<td>" + row.data.output + "</td>";
		text += "</tr>";
	}
	tableTaskData.innerHTML = text;
};
let insertStatusContent = function (data) {
	let out = "";
	let tableStatusData = document.querySelector("#status-overview tbody");

	for (let i = 0; i < data.length; i++) {
		out += "<tr>";
		let row = data[i];
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
};
//-----------------------Posts------------------------------------------------
let changeStatus = function (id, status) {
	let data = { "id": id, "status": status };
	posts("Status", JSON.stringify(data), function() {
		fetchContent('Status');
	});
};

let sendTaskForm = function (e) {
	let data = { "type":document.getElementById("type").value, "data":  { "input": document.getElementById("datainput").value } };
	posts("Tasks", JSON.stringify(data), function() {
		fetchContent('Tasks');
	});
	console.log(data);
	e.preventDefault();
};



let posts = function(api, json, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', botnet + api, true);
	xhr.responseType = "json";
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('token', mytoken);

	xhr.onload = function (e) {
		if (this.status === 200) {
			let data = xhr.response;
			if (data !== null && data.message !== "OK") {
				alert("ERROR");
			} else {
				callback();
			}
		}

	};
	xhr.send(json);
};

let bindform = function() {
	let formTasks = document.querySelector("#form");
	formTasks.addEventListener("submit", function(e) {
		sendTaskForm(e);
	});
};
//----------------------------------------------------------------------

// (function(){
fetchContent('Status');
fetchContent('Tasks');
initialiseSidebar();
bindform();
// })();



