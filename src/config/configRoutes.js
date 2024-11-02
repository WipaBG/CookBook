const { catalogRouter } = require("../controllers/catalogCtrl")
const { homeRouter } = require("../controllers/homeCtrl");
const { recipeRouter } = require("../controllers/recipeCtrl");
const { userRouter } = require("../controllers/userCtrl");

function configRoutes(app){
        app.use(homeRouter)
        app.use(catalogRouter);
        app.use(userRouter);
        app.use(recipeRouter);

        app.get('*', (req,res)=>{
            res.render('404');
        })
}

module.exports = {
    configRoutes
}