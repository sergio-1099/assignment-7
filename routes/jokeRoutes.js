"use strict";
const express = require("express");
const router = express.Router();
const jokeController = require('../controllers/jokeController');

router.get("/categories", jokeController.fetchAllCategories);
router.get("/category/:id", jokeController.fetchJokesFromCategory);
router.get("/random", jokeController.fetchRandomJoke);
router.post("/", jokeController.createJoke);
module.exports = router;