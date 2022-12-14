//Query Selectors
let recipForm = document.querySelector("#recipe-form");
let recipeContainer = document.querySelector("#recipe-container");
let listItems = [];

// FUNCTIONS
function handleFormSubmit(e) {
  e.preventDefault();

  const name = DOMPurify.sanitize(recipForm.querySelector("#name").value);
  const method = DOMPurify.sanitize(recipForm.querySelector("#method").value);
  const roast = DOMPurify.sanitize(recipForm.querySelector("#roast").value);
  const grind = DOMPurify.sanitize(recipForm.querySelector("#grind").value);
  const ratio = DOMPurify.sanitize(recipForm.querySelector("#ratio").value);
  const note = DOMPurify.sanitize(recipForm.querySelector("#note").value);

  const newRecipe = {
    name,
    method,
    roast,
    grind,
    ratio,
    note,
    id: Date.now(),
  };

  listItems.push(newRecipe);
  e.target.reset();
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
}

function displayRecipes() {
  let tempString = listItems
    .map(
      (item) => `
  <div class="col">
   <div class="card mb-4 rounded-3 shadow-sm border-dark">
    <div class="card-header py-3 text-white bg-dark">
     <h4 class="my-0">
      ${item.name}
     </h4>
    </div>
    <div class="card-body">
     <ul class="text-start">
      <li><strong>Method: </strong> ${item.method}</li>
      <li><strong>Roast: </strong> ${item.roast}</li>
      <li><strong>Grind Size: </strong> ${item.grind}</li>
      <li><strong>Ratio: </strong> ${item.ratio}</li>
      ${
        !item.note.length ? "" : `<li><strong>Note: </strong> ${item.note}</li>`
      }
     </ul>
      <button class="btn btn-lg btn-danger" aria-label='Delete ${
        item.name
      }' value='${item.id}'>Delete Recipe</button>
    </div>
   </div>
  </div>
 `
    )
    .join("");

  recipeContainer.innerHTML = tempString;
}

function mirrorStaeToLocalStorage() {
  localStorage.setItem("recipeContainer.list", JSON.stringify(listItems));
}

function loadInitialUI() {
  let tempLocalStorage = localStorage.getItem("recipeContainer.list");
  if (tempLocalStorage === null || tempLocalStorage === []) return;
  const tempRecipes = JSON.parse(tempLocalStorage);
  listItems.push(...tempRecipes);
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
}

function deleteRecipeFromList(id) {
  listItems = listItems.filter((item) => item.id !== id);
  recipeContainer.dispatchEvent(new CustomEvent("refreshRecipes"));
}

// EVENT LISTENERS
recipForm.addEventListener("submit", handleFormSubmit);
recipeContainer.addEventListener("refreshRecipes", displayRecipes);
recipeContainer.addEventListener("refreshRecipes", mirrorStaeToLocalStorage);
window.addEventListener("DOMContentLoaded", loadInitialUI);
recipeContainer.addEventListener("click", (e) => {
  if (e.target.matches(".btn-danger")) {
    deleteRecipeFromList(Number(e.target.value));
  }
});
