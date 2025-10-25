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
	async init() {
		const res = await axios.get("/apiKeys.json");
		this.headers.Authorization = res.data.TMDB_API_KEY;
	}
};

const urlParams = new URLSearchParams(window.location.search);
const movieID = urlParams.get('id');
const addMovieImages = async (movieID) => {
	await moviesApp.init();
	if (!movieID) {
		console.log("Movie Not Found!");
		return;
	}
	const res = await axios.get(`${moviesApp.movieEndpoint}/${movieID}/images`, {headers: moviesApp.headers, params: {include_image_language: "en,ta,null"}});
	const retrieved = res.data;
    document.querySelector("#movieTitle").innerText = urlParams.get('title');
	const backdropSize = moviesApp.sizeConfigs.backdropSizes[1];
	const posterSize = moviesApp.sizeConfigs.posterSizes[4];
	const logoSize = moviesApp.sizeConfigs.logoSizes[4];
	const bdContainer = document.querySelector(".backdrops");
	const logoContainer = document.querySelector(".logos");
	const posterContainer = document.querySelector(".posters");
	bdContainer.innerHTML = '';
	logoContainer.innerHTML = '';
	posterContainer.innerHTML = '';
	for (let bd of retrieved.backdrops) {
		let posterURL = `${moviesApp.imagesBaseURL}${backdropSize}${bd.file_path}`
		const img = document.createElement("img");
		img.setAttribute("src", posterURL);
		bdContainer.appendChild(img);
	}
	for (let logo of retrieved.logos) {
		let posterURL = `${moviesApp.imagesBaseURL}${logoSize}${logo.file_path}`
		const img = document.createElement("img");
		img.setAttribute("src", posterURL);
		logoContainer.appendChild(img);
	}
	for (let poster of retrieved.posters) {
		let posterURL = `${moviesApp.imagesBaseURL}${posterSize}${poster.file_path}`
		const img = document.createElement("img");
		img.setAttribute("src", posterURL);
		posterContainer.appendChild(img);
	}
};

addMovieImages(movieID);
