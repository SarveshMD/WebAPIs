// fetch("https://www.swapi.tech/api/people/4")
// 	.then((res) => {
// 		console.log("Got inhabitant!");
// 		return res.json();
// 	})
// 	.then((data) => {
// 		console.log(data.result.properties);
// 		return fetch(data.result.properties.homeworld);
// 	})
// 	.then((res) => {
// 		console.log("Got planet!");
// 		return res.json();
// 	})
// 	.then((data) => {
// 		console.log(data.result.properties);
// 	})
// 	.catch((err) => {
// 		console.log("Error!");
// 		console.log(err);
// 	});

const loadStarWarsCharacter = async (id) => {
	const res = await fetch(`https://www.swapi.tech/api/people/${id}`);
	const data = await res.json();
	console.log(`Person ${id}: `, data.result.properties);
	const planet = await fetch(data.result.properties.homeworld);
	const planetData = await planet.json();
	console.log(`Planet ${id}: `, planetData.result.properties);
};

const loadOneByOne = async () => {
	for (let i = 1; i <= 5; i++) {
		await loadStarWarsCharacter(i);
	}
};

loadOneByOne();
