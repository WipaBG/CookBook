const { Router } = require("express");
const { getAll } = require("../services/recipeService");
const { parseError } = require("../utils");
const { Recipe } = require("../models/Recipe");

//TODO replace with real router according to exam description
const homeRouter = Router();
homeRouter.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(3).lean();
        res.render('home', { recipes });
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.render('home', { errors: parseError(err).errors });
    }
});

module.exports = {
    homeRouter,
};

module.exports = {
    homeRouter,
}

