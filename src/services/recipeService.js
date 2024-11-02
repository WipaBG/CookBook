const { Recipe } = require("../models/Recipe");

async function getAll() {
  return Recipe.find().lean();
}

async function getById(id) {
  return Recipe.findById(id).lean();
}

async function create(data, authorId) {

  const record = new Recipe({
    title: data.title,
    ingredients: data.ingredients,
    instructions: data.instructions,
    description: data.description,
    image: data.image,
    owner: authorId,
  });

  await record.save();

  return record;
}

async function update(id, data, userId) {
  const record = await Recipe.findById(id);

  if (!record) {
    throw new ReferenceError("Record not found", id);
  }

  if (record.owner.toString() != userId) {
    throw new Error("Acces denied");
  }


  record.title = data.title,
    record.ingredients = data.ingredients,
    record.instructions = data.instructions,
    record.description = data.description,
    record.image = data.image,
    await record.save();

  return record;
}

async function deleteById(id, userId) {
  const record = await Recipe.findById(id);
  if (!record) {
    throw new ReferenceError("Record not found", id);
  }

  if (record.owner.toString() != userId) {
    throw new Error("Acces denied!");
  }

  await Recipe.findByIdAndDelete(id);
}


async function recommend(recipeId, userId){
  const record = await Recipe.findById(recipeId);

  if(!record){
    throw new ReferenceError("Record not found", recipeId);
  }
  if (record.owner.toString() == userId) {
    throw new Error("Cannot vote for your own publication!");
  }

  if(record.recommendList.find(v=>v.toString() == userId)){
    throw new Error("Only one vote is allowed");

  }

  record.recommendList.push(userId);

  await record.save();

  return record;

}

async function searchRecipe(name) {
  const query = {};

  if (name) {
      query.title = new RegExp(name, 'i');
  }

  return Recipe.find(query).lean();
}


module.exports = {
  getAll,
  getById,
  create,
  recommend,
  update,
  deleteById,
  searchRecipe
};
