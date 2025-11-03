"use strict";
(function () {
  const MY_SERVER_BASEURL = "jokebook";
  window.addEventListener("load", init);
  function init() {
    getJoke();
    setUpCategories();
    id('joke-form').addEventListener('submit', submitJoke);
    id('category-form').addEventListener('submit', search);
  }

  function getJoke() {
    let randomJokeDiv = id("random-joke");
    fetch(MY_SERVER_BASEURL + "/random")
      .then(checkStatus)
      .then((response) => {
        addJoke(randomJokeDiv, response);     
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }

  function setUpCategories() {
    let categoryListDiv = id("category-list");
    let response = getCategories();
    response.then((response) => {
      for (let category of response) {
        let b = document.createElement("button");
        b.appendChild(document.createTextNode(category.name));
        b.addEventListener("click", () => { addCategoryJokes(category.id, id('jokes-list')); });
        categoryListDiv.appendChild(b);
    }});
  }

  function addCategoryJokes(categoryID, div) {
    div.replaceChildren();

    let jokesList = document.createElement("div");

    fetch(MY_SERVER_BASEURL + "/category/" + categoryID)
      .then(checkStatus)
      .then((response) => {
        for (let joke of response) {
          let jokeDiv = document.createElement("div");
          addJoke(jokeDiv, joke);
          jokesList.appendChild(jokeDiv);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    div.appendChild(jokesList);
  }


  function addJoke(jokeDiv, responseObject) {
    let setup = document.createElement("p");
    setup.appendChild(document.createTextNode(responseObject.setup));
    let delivery = document.createElement("p");
    delivery.appendChild(document.createTextNode(responseObject.delivery));
    jokeDiv.appendChild(setup);
    jokeDiv.appendChild(delivery);
  }

  function search(event) {
    event.preventDefault();
    let categoryName = id('category-input').value.trim();
    let categoryID = null;

    getCategories().then((categories) => {
      for (let category of categories) {
        if (category.name == categoryName) {
          console.log('Found category:', category.name);
          categoryID = category.id;
        }
      }
      if (categoryID) {
        addCategoryJokes(categoryID, id('jokes-list'));
      } else {
        let errorMessage = 'Category not found: ' + categoryName;
        let errorDiv = id('jokes-by-category');
        errorDiv.replaceChildren();
        errorDiv.appendChild(document.createTextNode(errorMessage));
        console.error('Invalid category name');
      }
    });
  }

  async function submitJoke(event) {
    event.preventDefault();
    let setup = id('joke-setup').value.trim();
    let delivery = id('joke-delivery').value.trim();
    let categoryName = id('joke-category').value.trim();
    let categoryID = null;

    let categories = await getCategories();
    for (let category of categories) {
      if (category.name == categoryName) {
        console.log('Found category:', category.name);
        categoryID = category.id;
        break;
      }
    }
    if (!categoryID) {
      let errorMessage = 'Category not found: ' + categoryName;
      let errorDiv = id('form-response');
      errorDiv.appendChild(document.createTextNode(errorMessage));

      console.error('Invalid category name');
      return;
    }

    try {
      const resp = await fetch(MY_SERVER_BASEURL + '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup, delivery, categoryID })
      });
      if (!resp.ok) throw new Error('Server error: ' + resp.status);
      const newJoke = await resp.json();
      console.log('Created', newJoke);
      // update UI (clear form, show success, append joke, etc.)
      addCategoryJokes(categoryID, id('form-response'));
      event.target.reset();
    } catch (err) {
      console.error('Submit failed', err);
    }
  }

  async function getCategories() {
    return fetch(MY_SERVER_BASEURL + "/categories")
      .then(checkStatus)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }
  
  //helper functions
  function id(idName) {
    return document.getElementById(idName);
  }
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response.json();
  }

})();