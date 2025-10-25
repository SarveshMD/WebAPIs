const moviesApp = {
	movieSearchEndpoint: "https://api.themoviedb.org/3/search/movie",
	configEndpoint: "https://api.themoviedb.org/3/configuration",
	movieEndpoint: "https://api.themoviedb.org/3/movie",
	imagesBaseURL: "https://image.tmdb.org/t/p/",
	sizeConfigs: {
		backdropSizes: ['w300', 'w780', 'w1280', 'original'],
		logoSizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
		posterSizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
		profileSizes: ['w45', 'w185', 'h632', 'original'],
		stillSizes: ['w92', 'w185', 'w300', 'original'],
	},
	addedMovies: [],
	imgConfig: {},
	headers : {
		Authorization: "",
		accept: "application/json",
	},
	queryParam: "",
	page: 1,
	async init() {
		const res = await axios.get("/apiKeys.json");
		this.headers.Authorization = res.data.TMDB_API_KEY;
	}
};
moviesApp.init();

document.querySelector("#searchForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	const query = this.elements.query.value;
	this.elements.query.value = "";
	moviesApp.queryParam = query;
	moviesApp.page = 1;
	const movie = await getMovieData(query);
});

document.querySelector("#loadMore").addEventListener("click", async function() {
	await getMovieData(moviesApp.queryParam, ++moviesApp.page);
})

const container = document.querySelector("#results");

const logMovie = (movie) => {
	moviesApp.addedMovies.push(movie);
	console.group(`🎬 ${movie.title} (${movie.release_date.slice(0, 4)})`);
	console.log(`Score: ${movie.score}`);
	console.groupEnd();
};

const getMovieData = async (query, page) => {
	console.log("Called");
	console.log(page);
	const config = {
		headers: moviesApp.headers,
		params: {
			query: query,
			page: page
		},
	};

	let bestMatch;
	const res = await axios.get(moviesApp.movieSearchEndpoint, config);
	console.log(res.data);
	if (!page || page===1) {
		container.innerHTML = '';
	}
	try {
		for (let match of res.data.results) {
			const card = document.createElement("div");
			card.classList.add("card");
			const h2 = document.createElement("h2");
			h2.innerHTML = `${match.title} (${match.release_date.slice(0, 4)}, ${match.original_language})`;
			const p = document.createElement("p");
			p.innerText = match.overview;
			const img = document.createElement("img");
			const imgURL = `${moviesApp.imagesBaseURL}w342${match.poster_path}`;
			img.setAttribute("src", imgURL);
			img.setAttribute("id", match.id);
			img.setAttribute("alt", match.title);
			img.addEventListener("click", imageClicked);
			card.appendChild(img);
			card.appendChild(h2);
			card.appendChild(p);
			container.appendChild(card);

		}
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
	console.log(bestMatch);
	logMovie(bestMatch);
	return bestMatch;
};

function imageClicked() {
	const params = {
		id: this.getAttribute("id"),
		title: this.getAttribute("alt")
	}
	const url = new URL("/viewPosters", window.location.origin);
	url.search = new URLSearchParams(params).toString();
	window.open(url.toString(), "_blank");
};

const images = document.querySelectorAll("img")
images.forEach(image => {
	image.addEventListener("click", imageClicked);
});