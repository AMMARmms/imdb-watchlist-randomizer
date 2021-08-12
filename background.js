// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
//     chrome.scripting
//       .executeScript({
//         target: { tabId: tabId },
//         files: ["./getMultimedias.js"],
//       })
//       .then((res) => {
//         console.log("executed getMultimedias script");
//       })
//       .catch((err) => console.log(err));
//   }
// });

const executeScripstOnTab = (tabId, files) => {
  chrome.scripting
    .executeScript({
      target: { tabId: tabId },
      files,
    })
    .then((res) => {
      console.log("executed getMultimedias script");
    })
    .catch((err) => console.log(err));
};

// If you have access to someone else's public watchlist, this will still return true.
const imdbWatchlistUrlRegex = (url) => /.*imdb.com.*watchlist.*/.test(url);

const urlIsImdbWatchlistPage = (url) => {
  const itIsWatchlistPage = imdbWatchlistUrlRegex(url);
  chrome.runtime.sendMessage({
    message: "watchlist_url_validation",
    payload: itIsWatchlistPage,
  });
  return itIsWatchlistPage;
};

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.message && request.message === "scan_watchlist") {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      function (tabArray) {
        const activeTab = tabArray[0];
        if (tabArray && activeTab && urlIsImdbWatchlistPage(activeTab.url)) {
          executeScripstOnTab(activeTab.id, ["./getMultimedias.js"]);
          // executeScripstOnTab(activeTab.id, [
          //   "./misc/getMultimediasToDebug.js",
          // ]);
        } else {
          console.log("Page is not a watchlist page or no active tab");
        }
      }
    );
  }
});
