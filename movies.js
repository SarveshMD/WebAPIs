const moviesApp = {
	form: document.querySelector("#searchForm"),
	container: document.querySelector(".container"),
	movieSearchEndpoint: "https://api.themoviedb.org/3/search/movie",
	configEndpoint: "https://api.themoviedb.org/3/configuration",
	API_KEY: null,
	addedMovies: [],
	imgConfig: {},
	headers: {},
	async init() {
		const res = await axios.get("/apiKeys.json");
		this.API_KEY = res.data.TMDB_API_KEY;
		this.headers = {
			Authorization: this.API_KEY,
			accept: "application/json",
		};
		const configRes = await axios.get(this.configEndpoint, { headers: this.headers });
		this.imgConfig = configRes.data;
	},
};
moviesApp.init();

moviesApp.form.addEventListener("submit", async function (event) {
	event.preventDefault();
	const query = this.elements.query.value;
	this.elements.query.value = "";
	await addMovieImage(query);
});

const addMovieImage = async (query) => {
	const movie = await getMovieImageURL(query);
	if (!movie) {
		console.log("Movie Not Found!");
		return;
	}
	const img = document.createElement("img");
	img.setAttribute("src", movie.posterURL);
	moviesApp.container.appendChild(img);
	logMovie(movie);
};

const logMovie = (movie) => {
	moviesApp.addedMovies.push(movie);
	console.group(`🎬 ${movie.title}`);
	console.log(`Score: ${movie.score}`);
	console.log("Poster:", movie.posterURL);
	console.groupEnd();
};

const getMovieImageURL = async (query) => {
	const config = {
		headers: moviesApp.headers,
		params: {
			query: query,
		},
	};

	let bestMatch;
	const res = await axios.get(moviesApp.movieSearchEndpoint, config);
	try {
		let exactMatches = res.data.results.filter((result) => result.original_title.toLowerCase() === query.toLowerCase());
		if (exactMatches.length === 0) {
			console.log("No Exact Results, falling back...");
			exactMatches = res.data.results;
		}
		bestMatch = exactMatches.reduce((bestMatch, current) => {
			return current.vote_count * current.popularity > bestMatch.vote_count * bestMatch.popularity ? current : bestMatch;
		});
		bestMatch.score = Math.round(bestMatch.vote_count * bestMatch.popularity);
	} catch (e) {
		return false;
	}
	const baseURL = moviesApp.imgConfig.images.base_url;
	const fileSize = "original";
	const posterPath = bestMatch.poster_path;
	bestMatch.posterURL = `${baseURL}${fileSize}${posterPath}`;
	return bestMatch;
};
