// const tvShows = ["The Watcher", "Stranger Things", "Dark", "Game of Thrones", "The Queen's Gambit", "House of the Dragon", "Normal People", "Adolescence", "The Penguin", "The Last of Us", "Loki", "WandaVision", "What If...?", "Moon Knight", "Hawkeye", "The Night Agent", "Fool Me Once", "The Summer I Turned Pretty", "A Good Girl's Guide To Murder", "The Haunting of Hill House", "3 Body Problem"];

// axios
// 	.get("https://api.tvmaze.com/search/shows?q=stranger+things")
// 	.then((res) => {
// 		console.log(res.data[0].show);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

const form = document.querySelector("#searchForm");
const container = document.querySelector(".container");

form.addEventListener("submit", async function (event) {
	event.preventDefault();
	const query = this.elements.query.value;
	this.elements.query.value = "";
	await addTVShowImage(query);
});

const addTVShowImage = async (query) => {
	const resultArray = await getTVShows(query);
	let topURL;
	if (!resultArray) {
		console.log("Error getting a response from API");
		return;
	}
	if (resultArray[0]) {
		if (resultArray[0].show.image) {
			topURL = resultArray[0].show.image.original;
		} else {
			console.log(`No image found for "${query}"`);
			return;
		}
		const img = document.createElement("img");
		img.setAttribute("src", topURL);
		container.appendChild(img);
		console.log(`Added ${resultArray[0].show.name}`);
	} else {
		console.log(`No results found for "${query}"`);
	}
};

const getTVShows = async (query) => {
	try {
		const config = { params: { q: query } };
		const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
		return res.data;
	} catch (err) {
		return false;
	}
};

// without axios
const getTVShowsWithoutAxios = async (query) => {
	try {
		const params = new URLSearchParams({ q: query }).toString();
		const res = await fetch(`https://api.tvmaze.com/search/shows?${params}`);
		const data = await res.json();
		console.log(data);
		return data;
	} catch (err) {
		return false;
	}
};
