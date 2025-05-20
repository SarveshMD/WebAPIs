// axios
// 	.get("https://www.swapi.tech/api/people/1")
// 	.then((res) => {
// 		console.log(res.data.result.properties);
// 	})
// 	.catch((err) => {
// 		console.log("Oh No!", err);
// 	});

const loadStarWarsCharacter = async (id) => {
	try {
		const res = await axios.get(`https://www.swapi.tech/api/people/${id}`);
		console.log(res.data.result.properties);
	} catch (error) {
		console.log("Error!", error);
	}
};

// loadStarWarsCharacter(4);

const loadDadJoke = async () => {
	const config = { headers: { Accept: "application/json" } };
	try {
		const res = await axios.get("https://icanhazdadjoke.com/", config);
		return res.data.joke;
	} catch (error) {
		return "Error! No jokes available at the moment!";
	}
};

const ul = document.querySelector("#jokes");

document.querySelector("#newJoke").addEventListener("click", async () => {
	const newJoke = document.createElement("li");
	newJoke.innerText = await loadDadJoke();
	ul.appendChild(newJoke);
});
