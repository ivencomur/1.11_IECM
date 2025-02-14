let pokeRepo = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function getAll() {
    return pokemonList;
  }
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.error("Invalid Pokémon object");
    }
  }
  function loadList() {
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => {
        json.results.forEach((item) => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch((error) => console.error(error));
  }
  function loadDetails(pokemon) {
    return fetch(pokemon.detailsUrl)
      .then((response) => response.json())
      .then((details) => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height / 10;
        pokemon.types = details.types.map((type) => type.type.name).join(", ");
        let image = new Image();
        image.src = pokemon.imageUrl;
        image.onload = function () {
          let originalWidth = image.naturalWidth;
          let originalHeight = image.naturalHeight;
          let modalImage = document.getElementById("modal-image");
          modalImage.style.maxWidth = `${originalWidth * 2.5}px`;
          modalImage.style.maxHeight = `${originalHeight * 2.5}px`;
          modalImage.srcset = `${pokemon.imageUrl} 1x, ${pokemon.imageUrl} 2x`;
          modalImage.src = pokemon.imageUrl;
        };
      })
      .catch((error) => console.error(error));
  }
  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      document.getElementById("pokemonModalLabel").innerText = pokemon.name;
      document.getElementById("modal-image").src = pokemon.imageUrl;
      document.getElementById(
        "modal-height"
      ).innerText = `Height: ${pokemon.height}m`;
      document.getElementById(
        "modal-types"
      ).innerText = `Types: ${pokemon.types}`;
      document.querySelector(".modal").style.display = "flex";
    });
  }
  function addButtonEvent(button, pokemon) {
    button.addEventListener("click", () => {
      showDetails(pokemon);
    });
  }
  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    let button = document.createElement("button");
    button.classList.add("pokemon-button");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemonModal");
    button.innerText = pokemon.name;
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
    addButtonEvent(button, pokemon);
  }
  document.querySelector(".modal").addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });
  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();
pokeRepo.loadList().then(() => {
  pokeRepo.getAll().forEach((pokemon) => {
    pokeRepo.addListItem(pokemon);
  });
});