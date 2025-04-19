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
	console.log("Submitted...");
	const query = this.elements.query.value;
	this.elements.query.value = "";
	const resultArray = await getTVShows(query);
	let topURL;
	if (resultArray[0]) {
		if (resultArray[0].show.image) {
			topURL = resultArray[0].show.image.medium;
		} else {
			console.log(`No image found for "${query}"`);
			return;
		}
		const img = document.createElement("img");
		img.setAttribute("src", topURL);
		container.appendChild(img);
	} else {
		console.log(`No results found for "${query}"`);
	}
});

const getTVShows = async (query) => {
	try {
		const config = { params: { q: query } };
		const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
		return res.data;
	} catch (err) {
		return "Error!";
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
		return "Error!";
	}
};
