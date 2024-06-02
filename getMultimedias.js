(function () {
  console.log("get multimedias running");

  const getTextContentIfExists = (div, query) => {
    const element = div.querySelector(query);
    return element ? element.textContent : "";
  };

  const constructMultimediasFromDivs = (multimediaDivs) => {
    return Array.from(multimediaDivs).map((div) => {
      const titleTypeSpan = div.querySelector('span.dli-title-type-data');
      const multimediaType = titleTypeSpan && titleTypeSpan.textContent === 'TV Series'
        ? "series"
        : "movie";

      const posterContainer = div.querySelector('.ipc-poster');
      const imgHrefElem = posterContainer.querySelector('img');
      const imgSrc = imgHrefElem.src;
      
      const multimediaHref = div.querySelector('.ipc-lockup-overlay.ipc-focusable').href;

      const title = div.querySelector(".ipc-title__text").textContent.split('.')[1].trim();

      const [yearElement, runtimeElement] = div.querySelectorAll('.dli-title-metadata-item');

      const year = yearElement ? yearElement.textContent.trim() : '';
      const runtime = runtimeElement ? runtimeElement.textContent.trim() : '';

      // const genres = getTextContentIfExists(div, ".genre");
	  const voteCountElement = div.querySelector('.ipc-rating-star--voteCount');
      const voteCount = voteCountElement ? voteCountElement.textContent.trim() : '';
      const ratingIMDB = div.querySelector('[data-testid="ratingGroup--imdb-rating"]').textContent.replace(/\u00A0/g, ' ').split(' ')[0];
      const ratingMetac = getTextContentIfExists(div, ".metacritic-score-box");
	  
      const story = div.querySelector('.ipc-html-content-inner-div').textContent;
      const creditsElem = div.querySelector(".dli-plot-container").nextElementSibling;
      const credits = creditsElem
        ? Array.from(creditsElem.children)
            // .filter((elem) => elem.tagName !== "SPAN") // TODO split based on director and stars span
            .map((elem) => elem.textContent)
        : [];

      return {
        title,
        multimediaHref,
        imgSrc,
        year,
        runtime,
        genres: "", // TODO: Cut support for this as IMDB no longer displays genre content
		voteCount,
        ratingIMDB,
        ratingMetac,
		story,
        credits,
        multimediaType,
      };
    });
  };

  const clearLoadMore = async () => {
    // gets all of the multimedia divs
    const multimediaDivs = document.querySelectorAll(".ipc-metadata-list-summary-item");

    // sends the constructor multimedia objects
    const multimedias = constructMultimediasFromDivs(multimediaDivs);
    console.log(multimedias)

    chrome.runtime.sendMessage({
      message: "all_multimedia",
      payload: JSON.stringify(multimedias),
    });
  };
  
  const numOfTitlesElem = document.querySelector('[data-testid="list-page-mc-total-items"]');
  const numOfTitles = numOfTitlesElem.textContent.split(' ')[0];

  const loadMore = () => {
	// const scrollAmount = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollAmount = 212 * 25; // each element's height is close to 212px and to make sure we load all the images we scroll 25 elements by 25
    document.documentElement.scrollTop += scrollAmount;

    const backgroundElem = document.querySelector('.ipc-page-background');
    const backgroundElemHeight = window.getComputedStyle(backgroundElem).height;
    const backgroundElemHeightInt = parseInt(backgroundElemHeight);
    console.log('backgroundElemHeight height:', backgroundElemHeightInt);
	
    const maxScrollPos = backgroundElemHeightInt - 600;
    // Define event listener function
    function handleScroll() {
      const currentScrollPos = window.pageYOffset;
      // Check if the scroll position exceeds the maximum
      if (currentScrollPos > maxScrollPos) {
        window.scrollTo(0, maxScrollPos);
      }
   }

   window.addEventListener('scroll', handleScroll);
   setTimeout(function() {
     window.removeEventListener('scroll', handleScroll);
   }, 650);

    const allTitles = document.querySelectorAll(".ipc-metadata-list-summary-item");
    const targetElement = allTitles[allTitles.length - 1];
    const targetTextElem = targetElement ? targetElement.querySelector(".ipc-title__text") : null;

    if (targetTextElem && targetTextElem.textContent.trim().startsWith(numOfTitles) && isInView(targetElement)) {
      clearLoadMore();
    } else {
      setTimeout(loadMore, 500);
    }
  };

  chrome.runtime.sendMessage({
    message: "scanning_has_started",
  });
  
  loadMore();
})();

function isInView(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

  return (vertInView && horInView);
}
