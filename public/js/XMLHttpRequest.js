const request = new XMLHttpRequest();
const url = "https://www.swapi.tech/api/people/1";

let response;

request.onload = function () {
	console.log("Loaded...");
	console.log(this);
	response = JSON.parse(this.responseText).result.properties;
	console.log(response.name, response.hair_color, response.gender);
};

request.onerror = function () {
	console.log("Error!");
	console.log(this);
};

request.open("GET", url);
request.setRequestHeader("Accept", "application/json");
request.send();
