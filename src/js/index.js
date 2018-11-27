import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {};

const controlSearch = async () => {
  const query = searchView.getInputValue();

  if (query) {
    state.search = new Search(query);

    searchView.clearInputValue();
    searchView.clearResultsList();
    renderLoader(elements.searchResults);

    try {
      await state.search.getResults();
      
      clearLoader();
      searchView.renderResults(state.search.results);
    } catch (err) {
      alert("Can't load the recipes!")
      clearLoader();
    }

    
  }

}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultsPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResultsList();
    searchView.renderResults(state.search.results, 10,goToPage);
  }
});

const controlRecipe = async () => {
  const id = window.location.hash.replace('#','');
  console.log(id);

  if (id){
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    if (state.search) searchView.highlightSelected(id);

    state.recipe = new Recipe(id);

    try{
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
  
      state.recipe.calcTime();
      state.recipe.calcServings();
  
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    }catch (err){
      console.log(err);
      alert('Error processing Recipe');
    }
  } 
};

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *') ) {
    if (state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *') ) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
  console.log(state.recipe);
})