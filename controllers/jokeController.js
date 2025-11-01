"use strict";
const model = require('../models/jokeModel');

async function fetchAllCategories(req, res) {
    try {
        const categories = await model.getAllCategories();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function fetchJokesFromCategory(req, res) {
    const categoryID = req.params.id;
    if (categoryID) {
        try {
            const jokes = await model.getJokesFromCategory(categoryID);
            res.json(jokes);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    } else {
        res.status(400).send("Missing required category id param!");
    }
}

async function fetchRandomJoke(req, res) {
    try {
        const randomJoke = await model.getRandomJoke();
        res.json(randomJoke);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function createJoke(req, res) {
    const { setup, delivery, categoryID } = req.body;
    if (setup && delivery && categoryID ) {
        try {
            const newJoke = await model.addJoke(setup, delivery, categoryID);
            res.status(201).json(newJoke);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    } else {
        res.status(400).send("Missing required joke fields!");
    }
}

module.exports = {
    fetchAllCategories,
    fetchJokesFromCategory,
    fetchRandomJoke,
    createJoke
};