// const create = (imageDiv) => {
//   const posterSrc = imageDiv.firstElementChild.firstElementChild.src;
//   return document.createElement("img", { src: posterSrc });
// };

const addClassesToHTMLElem = (elem, classesString) => {
  elem.classList.add(...classesString.split(" "));
};

const createTitleElem = (mmedia) => {
  const titleHrefElem = document.createElement("a");
  titleHrefElem.href = mmedia.multimediaHref;
  titleHrefElem.textContent = mmedia.title;
  addClassesToHTMLElem(titleHrefElem, "title");
  return titleHrefElem;
};

const createYearElem = (year) => {
  const yearElem = document.createElement("p");
  yearElem.textContent = year;
  addClassesToHTMLElem(yearElem, "year mb-3");
  return yearElem;
};

const createIMDBRatingElem = (rating) => {
  const ratingElem = document.createElement("li");
  addClassesToHTMLElem(ratingElem, "rating");
  ratingElem.innerHTML = '<span class="star"></span>' + rating;
  return ratingElem;
};

const createMetascoreElem = (score) => {
  const scoreElem = document.createElement("li");
  scoreElem.textContent = score;
  const scoreClass =
    +score > 60
      ? "metacritic-favorable"
      : +score > 39
      ? "metacritic-average"
      : "metacritic-unfavorable";
  addClassesToHTMLElem(scoreElem, "mx-auto rating metacritic " + scoreClass);
  return scoreElem;
};

const createRatingsElem = (mmedia) => {
  const ratingsElem = document.createElement("ul");
  addClassesToHTMLElem(ratingsElem, "ratings");
  ratingsElem.appendChild(createIMDBRatingElem(mmedia.ratingIMDB));
  ratingsElem.appendChild(createMetascoreElem(mmedia.ratingMetac));
  return ratingsElem;
};

const createPosterElem = (src, showPoster = true) => {
  const posterElem = document.createElement("img", { alt: "poster" });
  showPoster
    ? (posterElem.src = src)
    : (posterElem.src = "https://picsum.photos/seed/imdb/96/142");
  addClassesToHTMLElem(posterElem, "poster");
  return posterElem;
};

const createRuntimeElem = (runtime) => {
  const runtimeELem = document.createElement("p");
  addClassesToHTMLElem(runtimeELem, "runtime");
  runtimeELem.textContent = runtime;
  return runtimeELem;
};

const createHeroicContent = (mmedia) => {
  const heroicDiv = document.createElement("div");
  addClassesToHTMLElem(heroicDiv, "mb-3 heroic-content");
  heroicDiv.appendChild(createRatingsElem(mmedia));
  heroicDiv.appendChild(createPosterElem(mmedia.imgSrc));
  heroicDiv.appendChild(createRuntimeElem(mmedia.runtime));
  return heroicDiv;
};

// genres: [Crime, Drama, Mystery]
const createGenresElem = (genres) => {
  const genresList = document.createElement("ul");
  addClassesToHTMLElem(genresList, "genres list-inline");
  genres.forEach((genre) => {
    const genreListItem = document.createElement("li");
    genreListItem.textContent = genre;
    addClassesToHTMLElem(genreListItem, "genre list-inline-item");
    genresList.appendChild(genreListItem);
  });
  return genresList;
};

const createCreditsElem = (credits) => {
  const creditsList = document.createElement("ul");
  addClassesToHTMLElem(creditsList, "credits list-inline");
  credits.forEach((credit) => {
    const creditListItem = document.createElement("li");
    creditListItem.textContent = credit;
    addClassesToHTMLElem(creditListItem, "credit list-inline-item");
    creditsList.appendChild(creditListItem);
  });
  return creditsList;
};

const createDivFromMultimedia = (mmedia) => {
  const div = document.createElement("div");
  const divClasses = "randomized-mmedia w-75 text-center mx-auto py-2";
  div.classList.add(...divClasses.split(" "));

  div.appendChild(createTitleElem(mmedia));
  div.appendChild(createYearElem(mmedia.year));
  div.appendChild(createHeroicContent(mmedia));
  div.appendChild(createGenresElem(mmedia.genres.split(", ")));
  div.appendChild(createCreditsElem(mmedia.credits));

  return div;
};

//**************** */

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const selectRandomMultimedia = (mmedias) => {
  const randInt = getRandomInt(0, mmedias.length);
  return mmedias[randInt];
};

const showRandomMultimedia = (mmedias) => {
  const mmedia = selectRandomMultimedia(mmedias);
  const mmediaDiv = createDivFromMultimedia(mmedia);
  document.querySelector("body").appendChild(mmediaDiv);
};

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log(request);
  if (request.message && request.message === "all_multimedia") {
    const multimedias = JSON.parse(request.payload);
    console.log("popup recieved the multimedia:");
    console.log(multimedias);
    showRandomMultimedia(multimedias);
  }
});
