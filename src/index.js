const express = require("express");
const { configDatabase } = require("./config/configDatabase");
const { configExpress } = require("./config/configExpress");
const { configHbs } = require("./config/congifHbs");
const { configRoutes } = require("./config/configRoutes");
const api = require('./services/recipeService')

start();

async function start() {
  const app = express();

  await configDatabase();
  configExpress(app);
  configHbs(app);
  configRoutes(app);

  app.listen(3000, () => {
    console.log("Server started");
  });


  // testFunciton();


}

async function testFunciton(){
  const result = await api.create({
    title:'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
    ingredients: '200g spaghetti / 100g pancetta / 2 large eggs / 50g pecorino cheese / 50g parmesan / Freshly ground black pepper / Salt / 2 cloves of garlic / 50g unsalted butter',
    instructions: 'Put a large saucepan of water on to boil. Finely chop the pancetta, having first removed any rind. Finely grate both cheeses and mix them together. Beat the eggs in a medium bowl, season with a little freshly grated black pepper and set everything aside. Add 1 tsp salt to the boiling water, add the spaghetti and when the water comes back to the boil, cook at a constant simmer, covered, for 10 minutes or until al dente. Squash 2 peeled plump garlic cloves with the blade of a knife, just to bruise it. While the spaghetti is cooking, fry the pancetta with the garlic. Keep the heat hot for a few minutes and when the pancetta is golden and crisp, discard the garlic. Take the pan off the heat and set aside. Save some of the pasta water and then drain the spaghetti and add it to the pancetta. Mix most of the cheese in with the eggs, keeping a small handful back for sprinkling over later. Quickly pour the eggs and cheese into the pasta, lifting up the spaghetti so it mixes easily. Use the reserved water to keep it saucy, if necessary. Serve immediately with a little sprinkling of the remaining cheese and a grating of black pepper.',
    image: 'https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-square640-v2.jpg',
  },'6678152650b4970431a9be5b')



//   title
// description
// ingredients
// instructions
// image
}