(function () {
  console.log("get multimedias running");

  const getTextContentIfExists = (div, query) => {
    const element = div.querySelector(query);
    return element ? element.textContent : "";
  };

  const constructMultimediasFromDivs = (multimediaDivs) => {
    return Array.from(multimediaDivs).map((div) => {
      const multimediaType = Array.from(div.classList).includes("series")
        ? "series"
        : "movie";

      const imgHrefElem =
        div.querySelector(".lister-item-image").firstElementChild;
      const multimediaHref = imgHrefElem.href;
      const imgSrc = imgHrefElem.firstElementChild.src;

      const title = div.querySelector(".lister-item-header").firstElementChild
        .textContent;
      // console.log(title);

      const year = getTextContentIfExists(div, ".lister-item-year");

      const runtimeQuery =
        multimediaType === "series"
          ? ".lister-item-details > span:nth-child(3)"
          : ".runtime";
      const runtime = getTextContentIfExists(div, runtimeQuery);

      const genres = getTextContentIfExists(div, ".genre");
      const ratingIMDB = getTextContentIfExists(div, ".ratings-imdb-rating");
      const ratingMetac = getTextContentIfExists(div, ".metascore");

      const creditsElem = div.querySelector(".lister-item-credits");
      const credits = creditsElem
        ? Array.from(creditsElem.children)
            .filter((elem) => elem.tagName !== "SPAN")
            .map((elem) => elem.textContent)
        : [];

      return {
        title,
        multimediaHref,
        imgSrc,
        year,
        runtime,
        genres,
        ratingIMDB,
        ratingMetac,
        credits,
        multimediaType,
      };
    });
  };

  const clearLoadMore = async () => {
    clearInterval(loadMoreInterval);

    // Gets the total num of titles from top of the page
    const numOfTitles = +document
      .querySelector(".lister-details")
      .firstChild.textContent.split(" ")[0];
    console.log(numOfTitles);

    // To load multimedias' content it scrolls ten by ten.
    // If the content is already loaded it just wait for 0.1 seconds,
    // otherwise it pauses for 2.5 seconds
    for (let i = 5; i < numOfTitles; i += 5) {
      const itemToScroll = document.querySelectorAll(".lister-item")[i];
      const timeout = itemToScroll.querySelector(".clearfix") ? 500 : 2000;
      itemToScroll.scrollIntoView();
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }

    // gets all of the multimedia divs
    const multimediaDivs = document.querySelectorAll(".lister-item");
    console.log(multimediaDivs.length);

    // sends the constructor multimedia objects
    const multimedias = constructMultimediasFromDivs(multimediaDivs);
    console.log(multimedias);
    chrome.runtime.sendMessage({
      message: "all_multimedia",
      payload: JSON.stringify(multimedias),
    });
  };

  // it first tries to load all multimedia by pressing the load more btn until it disappears
  // then in clearLoadMore fucntion, the app will scroll to load unloaded content
  const loadMore = () => {
    const loadMore = document.querySelector(".load-more");
    loadMore ? loadMore.click() : clearLoadMore();
  };
  chrome.runtime.sendMessage({
    message: "scanning_has_started",
  });
  const loadMoreInterval = setInterval(loadMore, 200);

  //  window.scrollBy(0, loadMore.offsetTop - document.body.scrollTop);
})();
