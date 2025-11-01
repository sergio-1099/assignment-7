"use strict";
const pool = require('../models/db');

async function getAllCategories() {
    const queryText = "SELECT * FROM categories";

    const result = await pool.query(queryText);
    return result.rows;
}

async function getJokesFromCategory(categoryID) {
    const queryText = "SELECT * FROM jokes where category_id= $1";
    const values = [categoryID];
    const result = await pool.query(queryText, values);
    return result.rows;
}


async function getRandomJoke() {
    let queryText = "SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1";
    const result = await pool.query(queryText);
    return result.rows[0];
}

async function addJoke(setup, delivery, categoryID) {
    let queryText = "INSERT INTO jokes ( setup, delivery, category_id ) VALUES ($1, $2, $3) RETURNING *";
    let values = [setup, delivery, categoryID];
    const result = await pool.query(queryText, values);
    return getJokesFromCategory(categoryID);
}
module.exports = {
    getAllCategories,
    getJokesFromCategory,
    getRandomJoke,
    addJoke
};