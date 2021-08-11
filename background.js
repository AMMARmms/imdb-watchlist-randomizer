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

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.message && request.message === "scan_watchlist") {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      function (tabArray) {
        if (tabArray && tabArray[0]) {
          executeScripstOnTab(tabArray[0].id, ["./getMultimedias.js"]);
        }
      }
    );
  }
});
