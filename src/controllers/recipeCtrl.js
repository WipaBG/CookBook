const { Router } = require("express");
const { body, validationResult } = require("express-validator");


const { isUser } = require("../middlewares/guards");
const { create, getById, update, deleteById, recommend } = require("../services/recipeService");
const { parseError } = require("../utils");

const recipeRouter = Router();

recipeRouter.get('/create', isUser(), (req,res)=>{
    res.render('create')
})

recipeRouter.post('/create', isUser(),
body("title").trim().isLength({ min: 2 }),
body("description").trim().isLength({ min: 10}, {max: 100}),
body("ingredients").trim().isLength({ min: 10},{ max:200 }),
body("instructions").trim().isLength({ min: 10 }),
body("image").trim().isURL({ require_tld: false, require_protocol: true }),

async(req,res)=>{
    const userId = req.user._id;

    try{
        const validation = validationResult(req);
        if (validation.errors.length) {
            throw validation.errors;
        }


        const result = await create(req.body, userId);
        res.redirect("/catalog");

    }catch (err) {
        res.render("create", { data: req.body, errors: parseError(err).errors });
    }
})

recipeRouter.get('/edit/:id', isUser(), async (req,res)=>{
    const id = req.params.id;

    const recipe = await getById(id);

    if(!recipe){
        res.status(404).render('404');
        return;
    }

    if(recipe.owner.toString() != req.user._id){
        res.redirect('/login');
    }
    res.render('edit', {data: recipe});

})
recipeRouter.post("/edit/:recipeId",
    isUser(),
    body("title").trim().isLength({ min: 2 }),
    body("description").trim().isLength({ min: 10}, {max: 100}),
    body("ingredients").trim().isLength({ min: 10},{ max:200 }),
    body("instructions").trim().isLength({ min: 10 }, { max: 2024 }),
    body("image").trim().isURL({ require_tld: false, require_protocol: true }),
    async (req, res) => {
        const recipeId = req.params.recipeId;
        const userId = req.user._id;

        try {
            const validation = validationResult(req);

            if (validation.errors.length) {
                throw validation.errors;
            }

            const result = await update(recipeId, req.body, userId);
            res.redirect("/catalog/"+recipeId);
        } catch (err) {
            res.render("edit", { data: req.body, errors: parseError(err).errors });
        }
    }
)


recipeRouter.get('/delete/:id', isUser(), async(req,res)=>{
    const id = req.params.id;
    try{
        await deleteById(id, req.user._id);
    }catch(err){
        if(err.message =='Access denied'){
            res.redirect('/login');
            return;
        }
    }
    res.redirect('/catalog')
})

recipeRouter.get('/recommend/:recipeId', isUser(), async(req,res)=>{
    const recipeId = req.params.recipeId;
    const userId = req.user._id;
    try{
        const result = await recommend(recipeId, userId);
        res.redirect('/catalog/'+recipeId);
    }catch(err){
        res.render('details', {errors: parseError(err).errors })
    }
})





module.exports = {
    recipeRouter,
}