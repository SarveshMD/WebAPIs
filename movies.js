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

let API_KEY = null;
const getAPIKey = async () => {
	const res = await fetch("/apiKeys.json");
	const data = await res.json();
	API_KEY = data.TMDB_API_KEY;
};
getAPIKey();

form.addEventListener("submit", async function (event) {
	event.preventDefault();
	const query = this.elements.query.value;
	this.elements.query.value = "";
	await addMovieImage(query);
});

const movieSearchEndpoint = "https://api.themoviedb.org/3/search/movie";
const configEndpoint = "https://api.themoviedb.org/3/configuration";

const addMovieImage = async (query) => {
	const movie = await getMovieImageURL(query);
	if (!movie) {
		console.log("Movie Not Found!");
		return;
	}
	const imageURL = movie.URL;
	console.log(imageURL);
	const img = document.createElement("img");
	img.setAttribute("src", imageURL);
	container.appendChild(img);
	console.log(`Added "${movie.title}"`);
};

const getMovieImageURL = async (query) => {
	const config = {
		headers: {
			Authorization: API_KEY,
			accept: "application/json",
		},
		params: {
			query: query,
		},
	};
	// const params = new URLSearchParams(config.params).toString();
	// const res = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, { headers: config.headers });
	// const data = await res.json();
	// console.log(data);

	let bestMatch;
	const res = await axios.get(movieSearchEndpoint, config);
	try {
		let exactMatches = res.data.results.filter((result) => result.original_title.toLowerCase() === query.toLowerCase());
		if (exactMatches.length === 0) {
			console.log("No Exact Results, falling back...");
			exactMatches = res.data.results;
		}
		bestMatch = exactMatches.reduce((bestMatch, current) => {
			return current.vote_count * current.popularity > bestMatch.vote_count * bestMatch.popularity ? current : bestMatch;
		});
	} catch (e) {
		return false;
	}
	console.log(bestMatch);
	console.log(`Retrieved "${bestMatch.original_title}"`);

	const configRes = await axios.get(configEndpoint, { headers: config.headers });
	// console.log(configRes.data);
	const baseURL = configRes.data.images.base_url;
	const fileSize = "original";
	// backdrop_sizes (4) ['w300', 'w780', 'w1280', 'original']
	// poster_sizes (7) ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original']
	const posterPath = bestMatch.poster_path;
	const posterURL = `${baseURL}${fileSize}${posterPath}`;
	return {
		URL: posterURL,
		title: bestMatch.original_title,
	};
	// const backdropPath = bestMatch.backdrop_path;
	// const backdropURL = `${baseURL}/${fileSize}${backdropPath}`;
	// console.log(backdropURL);

	// Image API
	// const movieId = bestMatch.id;
	// const imgConfig = {
	// 	headers: config.headers,
	// 	params: {
	// 		include_image_language: "en",
	// 	},
	// };
	// const imgResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, imgConfig);
	// const data = imgResponse.data;
	// console.log(data);
};
