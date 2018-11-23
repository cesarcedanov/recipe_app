import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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
    state.recipe = new Recipe(id);
    try{
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
  
      state.recipe.calcTime();
      state.recipe.calcServings();
  
      console.log(state.recipe);
    }catch (err){
      console.log(err);
      alert('Error processing Recipe');
    }
  } 
};

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));