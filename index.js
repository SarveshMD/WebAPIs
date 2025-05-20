const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/axios", (req, res) => {
    res.sendFile(path.join(__dirname, "public/axios.html"))
});

app.get("/fetch", (req, res) => {
    res.sendFile(path.join(__dirname, "public/fetch.html"))
});

app.get("/movies", (req, res) => {
    res.sendFile(path.join(__dirname, "public/movies.html"))
});

app.get("/tvshows", (req, res) => {
    res.sendFile(path.join(__dirname, "public/tvshows.html"))
});

app.get("/xml", (req, res) => {
    res.sendFile(path.join(__dirname, "public/XMLHttpRequest.html"))
});

app.listen(1989, () => {
    console.log("Listening on Port 1989...")
});