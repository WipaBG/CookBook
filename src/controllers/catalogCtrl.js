const { Router } = require("express");
const { getById, getAll, searchRecipe } = require("../services/recipeService");
const { ConnectionStates } = require("mongoose");

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req,res)=>{
    const recipes = await getAll();
    res.render('catalog', {recipes})
})


catalogRouter.get('/catalog/:id', async (req,res)=>{
    const id = req.params.id;

    const recipe = await getById(id);

    if(!recipe){
        res.status(404).render('404');
        return;
    }
    recipe.recommend = recipe.recommendList.length;
    recipe.hasUser = res.locals.hasUser;
    recipe.isAuthor  = req.user?._id== recipe.owner.toString();
    recipe.hasRocommended = Boolean(recipe.recommendList.find(v=> v.toString() == req.user?._id));


    res.render('details', {recipe})
})

catalogRouter.get('/search',async (req,res)=>{
    
    const name  = req.query;
        let recipes = [];
        if (name) {
            recipes = await searchRecipe(name.search);
        } else {
            recipes = await getAll();
        }

        res.render('search', { recipes, searchName: name.search });

});





module.exports = {
    catalogRouter
}